import { parsePhoneNumberFromString as parse } from 'libphonenumber-js'
import { isString } from 'lodash'

export const format = (value: string): string => {
  if (isString(value)) {
    const result = parse(value, 'BR')

    return result?.number ?? value
  }

  return value
}
