
export const appendIfNotEndsWith = (originalText: string, toAppend: string): string => {
  if (!originalText.endsWith(toAppend)) originalText += toAppend;
  return originalText;
}