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
    '^react$',
    '',
    '^next$',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/component(.*)$',
    '',
    '^@/type(.*)$',
    '',
    '^@/http(.*)$',
    '',
    '^@/store(.*)$',
    '',
    '^@/helper(.*)$',
    '',
    '^./(.*)$',
    '',
    '^../(.*)$'
  ],
  plugins: [plugin('prettier-plugin-tailwindcss'), plugin('@ianvs/prettier-plugin-sort-imports')],
  importOrderParserPlugins: ['jsx', 'typescript', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.9.3'
}

export default configuration
