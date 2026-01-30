/**
 * Helper functions for testing PSTricks parsing
 */

export function findPSTricksElement(parsed: any[], type: string, index: number = 0) {
  const pspicture = parsed.find((p: any) => p.type === 'pspicture');
  if (!pspicture || !pspicture.plot || !pspicture.plot[type]) {
    return null;
  }
  return pspicture.plot[type][index] || null;
}

export function getElementData(parsed: any[], type: string, index: number = 0) {
  const element = findPSTricksElement(parsed, type, index);
  return element?.data || null;
}
