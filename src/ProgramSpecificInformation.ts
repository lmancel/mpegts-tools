import { buildDescriptor, Descriptor } from './descriptors'

export interface IConditionalAccessTable {
    pointerField: number // 8-bit
    // pointer filler of pointerField * 8-bit
    tableId: number // 8-bit
    sectionSyntaxIndicator: number // 1-bit
    privateBit: number // 1-bit
    reservedBits: number // 2-bit
    sectionLength: number // 12-bit
    section: Buffer // sectionLength * 8-bit

    programDescriptors: Descriptor[] | null
}

export interface IElementaryStream {
	type: number
	pid: number
	esInfos: Descriptor[]
}

export class ProgramSpecificInformation implements IConditionalAccessTable {
    static isPat(pid: number) {
        return pid === 0x0000
    }

    static isCat(pid: number) {
        return pid === 0x0001
    }

    private _cache: Partial<IConditionalAccessTable & { elementaryStreams: IElementaryStream[] }> = {}

    private get tableStart(): number {
        return this.pointerField + 1
    }

    get pointerField(): number {
        return this._chunk[0]
    }

    get tableId(): number {
        return this._chunk[this.tableStart]
    }

    get sectionSyntaxIndicator(): number {
        return (this._chunk[this.tableStart + 1] & 0x80) >> 7
    }

    get privateBit(): number {
        return (this._chunk[this.tableStart + 1] & 0x40) >> 6
    }

    get reservedBits(): number {
        return (this._chunk[this.tableStart + 1] & 0x30) >> 4
    }

    get sectionLength(): number {
        return this._chunk.readUInt16BE(this.tableStart + 1) & 0x0fff
    }

    get section(): Buffer {
        const start = this.tableStart + 3
        return this._chunk.slice(start, start + this.sectionLength)
    }

    get tableIdExtension(): number {
        return this.section.readUInt16BE(0)
    }

    get versionNumber(): number {
        return (this.section[2] & 0x3e) >> 1
    }

    get isCurrentData(): boolean {
        return !!(this.section[2] & 0x01)
    }

    get sectionNumber(): number {
        return this.section[3]
    }

    get lastSectionNumber(): number {
        return this.section[4]
    }

    // PAT
    get programNum(): number {
        return this.section.readUInt16BE(5)
    }

    get programMapPid(): number {
        return this.section.readUInt16BE(7) & 0x1fff
    }

    // PMT
    get pcrPid(): number {
        return this.section.readUInt16BE(5) & 0x1fff
    }

    get programInfoLength(): number {
        return this.section.readUInt16BE(7) & 0x03ff
    }

    get programDescriptors(): Descriptor[] {
        if (this._cache.programDescriptors) {
            return this._cache.programDescriptors
        }

        const descriptors: Descriptor[] = []
        const programInfoLength = this.programInfoLength

        if (programInfoLength > 0) {
            let offset = 0

            while (offset < programInfoLength) {
                const currentDescriptor = buildDescriptor(this.section.slice(9 + offset))

				if (!currentDescriptor.length) {
					// Potentially a multi-section PSI, need more data to complete
					break
				}
                descriptors.push(currentDescriptor)
                offset += currentDescriptor.length
            }
        }

        return this._cache.programDescriptors = descriptors
    }

    get streamInfoData(): Buffer {
        const start = this.programInfoLength + 9
        return this.section.slice(start)
    }

    get elementaryStreams(): IElementaryStream[] {
		if (this._cache.elementaryStreams) {
			return this._cache.elementaryStreams
		}
		const streamInfoData = this.streamInfoData
		const elementaryStreams = []
		let offset = 0

		while (offset < streamInfoData.length - 4) { // -4 to take into account the 4 bytes CRC at the end
			const type = streamInfoData[offset]
			const pid = streamInfoData.readInt16BE(offset + 1) & 0x1fff
			const esInfoLength = streamInfoData.readInt16BE(offset + 3) & 0x0fff
			const esInfos = []
			let esInfosOffset = 0

			while (esInfosOffset < esInfoLength) {
				const currentDescriptor = buildDescriptor(streamInfoData.slice(offset + 5 + esInfosOffset))

				if (!currentDescriptor.length) {
					// Potentially a multi-section PSI, need more data to complete
					break
				}
				esInfos.push(currentDescriptor)
				esInfosOffset += currentDescriptor.length
			}

			elementaryStreams.push({
				type,
				pid,
				esInfos,
			})

			offset += 5 + esInfoLength
		}
		this._cache.elementaryStreams = elementaryStreams
		return elementaryStreams
    }

    constructor(private _chunk: Buffer) {}

	append(buffer: Buffer): this {
		this._chunk = Buffer.concat([this._chunk, buffer])
		this._cache = {}
		return this
	}
}
