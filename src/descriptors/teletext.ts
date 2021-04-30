import { Descriptor } from './descriptor'

// Source: ETSI EN 300 468 V1.15.1
enum TeletextType {
	INITIAL = 0x01, // initial Teletext page
	SUBTITLES = 0x02, // Teletext subtitle page                                                                        
	ADDITIONAL_INFO = 0x03, // additional information page                                   
	PROGRAM_SCHEDULE = 0x04, // programme schedule page
	SUBTITLES_HI = 0x05, // Teletext subtitle page for hearing impaired people
}

type TeletextDescriptorData = {
	language: string
	type: TeletextType
	magazineNumber: number
	pageNumber: number
}

const TELETEXT_DESCRIPTOR_DATA_LENGTH = 5

class TeletextDescriptor extends Descriptor {
	isTeletext = true


	get innerData(): TeletextDescriptorData[] {
		const data = []
	
		if (this.dataLength % TELETEXT_DESCRIPTOR_DATA_LENGTH) {
		  throw Error(`Invalid length for Teletext descriptor
			  (${this.dataLength} length, must be a multiple of ${TELETEXT_DESCRIPTOR_DATA_LENGTH})`)
		}
	
		let offset = 0
	
		while (offset < this.dataLength) {
			const language = this.data.slice(offset, offset + 3).toString() // 3 first bytes
			const type = this.data.readUInt8(offset + 3) & 0xf8 // first 5 bits of third byte
			const magazineNumber = this.data.readUInt8(offset + 3) & 0x07 // last 3 bits of third byte
			const pageNumber = this.data.readUInt8(offset + 4) // fourth byte

			data.push({ language, type, magazineNumber, pageNumber })
		
			offset += TELETEXT_DESCRIPTOR_DATA_LENGTH
		}
	
		return data
	}
}

export { TeletextDescriptor }
