import { Descriptor } from './descriptor'

// Source: ETSI EN 300 468 V1.15.1
enum SubtitlingType {
	EBU_TXT = 0x01, // EBU Teletext subtitles
	ASSOCIATED_EBU_TXT = 0x02, // associated EBU Teletext                                                                        
	VBI = 0x03, // VBI data                                   
	DVB_SUBTITLES = 0x10, // DVB subtitles (normal) with no monitor aspect ratio criticality
	DVB_SUBTITLES_4_3 = 0x11, // DVB subtitles (normal) for display on 4:3 aspect ratio monitor
	DVB_SUBTITLES_16_9 = 0x12, // DVB subtitles (normal) for display on 16:9 aspect ratio monitor
	DVB_SUBTITLES_221_1 = 0x13, // DVB subtitles (normal) for display on 2.21:1 aspect ratio monitor
	DVB_SUBTITLES_HD = 0x14, // DVB subtitles (normal) for display on a high definition monitor
	DVB_SUBTITLES_STEREOSCOPIC = 0x15, // DVB subtitles (normal) with plano-stereoscopic disparity for display on a high definition monitor
	DVB_SUBTITLES_HOH = 0x20, // DVB subtitles (for the hard of hearing) with no monitor aspect ratio criticality
	DVB_SUBTITLES_HOH_4_3 = 0x21, // DVB subtitles (for the hard of hearing) for display on 4:3 aspect ratio monitor
	DVB_SUBTITLES_HOH_16_9 = 0x22, // DVB subtitles (for the hard of hearing) for display on 16:9 aspect ratio monitor
	DVB_SUBTITLES_HOH_221_1 = 0x23, // DVB subtitles (for the hard of hearing) for display on 2.21:1 aspect ratio monitor
	DVB_SUBTITLES_HOH_HD = 0x24, // DVB subtitles (for the hard of hearing) for display on a high definition monitor
	DVB_SUBTITLES_HOH_STEREOSCOPIC = 0x25, // DVB subtitles (for the hard of hearing) with plano-stereoscopic disparity for display on a high definition monitor
	SIGN_LANGUAGE_OPEN = 0x30, // open (in-vision) sign language interpretation for the deaf
	SIGN_LANGUAGE_CLOSE = 0x31, // closed sign language interpretation for the deaf
	UP_SAMPLED = 0x40, // video up-sampled from standard definition source material
	SAOC_DE = 0x80, // dependent SAOC-DE data stream
}

type SubtitlingDescriptorData = {
	language: string
	type: SubtitlingType
	compositionPageId: number
	ancillaryPageId: number
}

const SUBTITLING_DESCRIPTOR_DATA_LENGTH = 8

class SubtitlingDescriptor extends Descriptor {
	isSubtitling = true

	get innerData(): SubtitlingDescriptorData[] {
		const data = []
	
		if (this.dataLength % SUBTITLING_DESCRIPTOR_DATA_LENGTH) {
		  throw Error(`Invalid length for Subtitling descriptor
			  (${this.dataLength} length, must be a multiple of ${SUBTITLING_DESCRIPTOR_DATA_LENGTH})`)
		}
	
		let offset = 0
	
		while (offset < this.dataLength) {
			const language = this.data.slice(offset, offset + 3).toString()
			const type = this.data.readUInt8(offset + 3)
			const compositionPageId = this.data.readUInt16BE(offset + 4)
			const ancillaryPageId = this.data.readUInt16BE(offset + 6)

			data.push({ language, type, compositionPageId, ancillaryPageId })
		
			offset += SUBTITLING_DESCRIPTOR_DATA_LENGTH
		}
	
		return data
	}
}

export { SubtitlingDescriptor, SubtitlingType }
