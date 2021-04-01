import { Descriptor, DescriptorTag } from './descriptor'
import { LanguageDescriptor } from './language'
import { CADescriptor } from './ca'

export function buildDescriptor(buffer: Buffer): Descriptor {
  const descriptorTag = buffer[0]
  const descriptorSize = buffer[1]
  const descriptor = buffer.slice(0, 2 + descriptorSize)

  switch (descriptorTag) {
    case DescriptorTag.CA:
      return new CADescriptor(descriptor)
    case DescriptorTag.ISO_639_LANGUAGE:
      return new LanguageDescriptor(descriptor)
    default:
      return new Descriptor(descriptor)
  }
}
