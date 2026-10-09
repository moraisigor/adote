import { fileURLToPath } from 'node:url'

const plugin = (name) => fileURLToPath(import.meta.resolve(name))

/** @type {import('prettier').Config} */
const configuration = {
  semi: false,
  printWidth: 110,
  quoteProps: 'consistent',
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  bracketSameLine: true,
  singleAttributePerLine: true,
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '^@nestjs/(.*)$',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/type/(.*)$',
    '',
    '^@/decorator/(.*)$',
    '',
    '^@/module/(.*)$',
    '',
    '^@/helper/(.*)$',
    '',
    '^./(.*)$',
    '',
    '^../(.*)$'
  ],
  plugins: [plugin('@ianvs/prettier-plugin-sort-imports')],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.9.3'
}

export default configuration
