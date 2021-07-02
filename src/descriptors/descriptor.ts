/**
 * https://gstreamer.freedesktop.org/documentation/mpegts/gstmpegtsdescriptor.html?gi-language=c#GstMpegtsDescriptorType
 * https://gstreamer.freedesktop.org/documentation/mpegts/gst-atsc-descriptor.html?gi-language=c#GstMpegtsATSCDescriptorType
 * https://gstreamer.freedesktop.org/documentation/mpegts/gst-dvb-descriptor.html?gi-language=c#GstMpegtsDVBDescriptorType
 */
export const DescriptorTag = {
    RESERVED_00: 0,
    RESERVED_01: 1,
    VIDEO_STREAM: 2,
    AUDIO_STREAM: 3,
    HIERARCHY: 4,
    REGISTRATION: 5,
    DATA_STREAM_ALIGNMENT: 6,
    TARGET_BACKGROUND_GRID: 7,
    VIDEO_WINDOW: 8,
    CA: 9,
    ISO_639_LANGUAGE: 10,
    SYSTEM_CLOCK: 11,
    MULTIPLEX_BUFFER_UTILISATION: 12,
    COPYRIGHT: 13,
    MAXIMUM_BITRATE: 14,
    PRIVATE_DATA_INDICATOR: 15,
    SMOOTHING_BUFFER: 16,
    STD: 17,
    IBP: 18,
    DSMCC_CAROUSEL_IDENTIFIER: 19,
    DSMCC_ASSOCIATION_TAG: 20,
    DSMCC_DEFERRED_ASSOCIATION_TAG: 21,
    DSMCC_NPT_REFERENCE: 23,
    DSMCC_NPT_ENDPOINT: 24,
    DSMCC_STREAM_MODE: 25,
    DSMCC_STREAM_EVENT: 26,
    MPEG4_VIDEO: 27,
    MPEG4_AUDIO: 28,
    IOD: 29,
    SL: 30,
    FMC: 31,
    EXTERNAL_ES_ID: 32,
    MUX_CODE: 33,
    FMX_BUFFER_SIZE: 34,
    MULTIPLEX_BUFFER: 35,
    CONTENT_LABELING: 36,
    METADATA_POINTER: 37,
    METADATA: 38,
    METADATA_STD: 39,
    AVC_VIDEO: 40,
    IPMP: 41,
    AVC_TIMING_AND_HRD: 42,
    MPEG2_AAC_AUDIO: 43,
    FLEX_MUX_TIMING: 44,
    MPEG4_TEXT: 45,
    MPEG4_AUDIO_EXTENSION: 46,
    AUXILIARY_VIDEO_STREAM: 47,
    SVC_EXTENSION: 48,
    MVC_EXTENSION: 49,
    VIDEO_J2K: 50,
    MVC_OPERATION_POINT: 51,
    MPEG2_STEREOSCOPIC_VIDEO_FORMAT: 52,
    STEREOSCOPIC_PROGRAM_INFO: 53,
    STEREOSCOPIC_VIDEO_INFO: 54,
	TELETEXT: 0x56,
	SUBTITLING: 0x59,
	AUDIO_DVB_AC3: 106,
	AUDIO_DVB_EAC3: 122,
	AUDIO_DVB_DTS: 123,
	AUDIO_DVB_AAC: 124,
	AUDIO_ATSC_AC3: 129,
	AUDIO_ATSC_EAC3: 204,
}

// const LanguageTypes = {
//   1: 'CLEAN_EFFECTS',
//   2: 'HEARING_IMPARED',
//   3: 'VISUALLY_IMPARED_COMMENTARY',
// }

export class Descriptor {
    get tag() {
        return this._chunk[0]
    }

    get data() {
        return this._chunk.slice(2)
    }

    get length() {
        return this._chunk.length
    }

    get dataLength() {
      return this._chunk[1]
    }

    isIsoLang = false
	isCa = false
	isSubtitling = false
	isTeletext = false

	isAudio: boolean
	isVideo: boolean

    constructor(protected readonly _chunk: Buffer) {
		this.isAudio = [
			DescriptorTag.AUDIO_STREAM,
			DescriptorTag.MPEG4_AUDIO,
			DescriptorTag.MPEG2_AAC_AUDIO,
			DescriptorTag.MPEG4_AUDIO_EXTENSION,
			DescriptorTag.AUDIO_DVB_AC3,
			DescriptorTag.AUDIO_DVB_EAC3,
			DescriptorTag.AUDIO_DVB_DTS,
			DescriptorTag.AUDIO_DVB_AAC,
			DescriptorTag.AUDIO_ATSC_AC3,
			DescriptorTag.AUDIO_ATSC_EAC3,
		].includes(this.tag)

		this.isVideo = [
			DescriptorTag.VIDEO_STREAM,
			DescriptorTag.MPEG4_VIDEO,
			DescriptorTag.AVC_VIDEO,
			DescriptorTag.VIDEO_J2K,
		].includes(this.tag)
	}
}
