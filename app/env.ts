export const get = <T = any>(property: string): T => <T>process.env[property]
