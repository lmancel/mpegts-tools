import { Descriptor } from './descriptor'

export class LanguageDescriptor extends Descriptor {
  isIsoLang = true

  // ISO Language
  get languages(): { code: string, type: number }[] {
    const languages = []

    if (this.dataLength % 4) {
      throw Error(`Invalid length for ISO Languages descriptor
          (${this.dataLength} length, must be a multiple of 4)`)
    }

    let offset = 0

    while (offset < this.dataLength) {
      languages.push({
        code: this.data.slice(offset, offset + 3).toString(),
        type: this.data[offset + 3],
      })

      offset += 4
    }

    return languages
  }
}
