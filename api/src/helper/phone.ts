import { parsePhoneNumberFromString as parse } from 'libphonenumber-js'

export const format = (value: string): string => {
  const result = parse(value, 'BR')

  return result?.number ?? value
}
