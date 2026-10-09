export const encode = (value: string): string => btoa(value)

export const decode = (value: string): string => atob(value)

export const escape = (value: string): string => value.replace(/[.+*^?$|\\()[\]{}-]/g, '\\$&')

export const normalize = (value: string): string =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
