// 0-31 basic control flow characters,
// eslint-disable-next-line no-control-regex
const controlFlowUnicodeRegex = /[\u0000-\u001F\u007F-\u009F]/g

// Control characters are special, invisible characters in the ASCII range 0-31.
// This method replaces them with empty text, because they are not allowed in XML
export function cleanControlFlowCharacters(text) {
  return text.replace(controlFlowUnicodeRegex, '')
}
