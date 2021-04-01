import { Descriptor } from './descriptor'

export class LanguageDescriptor extends Descriptor {
  get isIsoLang() {
    return true
  }

  // ISO Language
  get languages(): { code: string, type: number }[] {
    const languages = []

    if (this.dataLength % 4) {
      throw Error(`Invalid length for ISO Languages descriptor
          (${this.dataLength} length, must be a multiple of 4)`)
    }

    let offset = 0

    while (offset < this.dataLength) {
      const start = 2 + offset

      languages.push({
        code: this._chunk.slice(start, start + 3).toString(),
        type: this._chunk[start + 3],
      })

      offset += 4
    }

    return languages
  }
}
