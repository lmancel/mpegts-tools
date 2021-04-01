import { Descriptor } from './descriptor'

export class CADescriptor extends Descriptor {
  get isCa() {
    return true
  }

  // CA
  get caSystemId() {
    if (!this.isCa) {
      throw Error('Invalid call: this is not a CA descriptor.')
    }
    return this.data.slice(0, 2).readUInt16BE(0)
  }

  get caPid() {
    if (!this.isCa) {
      throw Error('Invalid call: this is not a CA descriptor.')
    }
    return this.data.slice(2, 4).readUInt16BE(0) & 0x1fff
  }
}
