export const generateProductCode = (
  categoryName: string,
  existingCodes: number[]
): string => {
  // Extract first and last letter of category name, convert to uppercase
  const prefix = categoryName
    .trim()
    .split('')
    .filter((char) => /[a-zA-Z]/.test(char))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (!prefix || prefix.length < 2) {
    return 'XX001' // Default if category name is invalid
  }

  // Filter existing codes for this prefix
  const prefixCodes = existingCodes
    .map((code) => {
      const codeStr = code.toString().padStart(6, '0') // Ensure 6 digits for parsing
      return codeStr.startsWith(prefix) ? parseInt(codeStr.slice(2)) : null
    })
    .filter((num) => num !== null) as number[]

  // Find the next sequence number
  const nextSeq = prefixCodes.length > 0 ? Math.max(...prefixCodes) + 1 : 1
  return `${prefix}${nextSeq.toString().padStart(3, '0')}`
}
