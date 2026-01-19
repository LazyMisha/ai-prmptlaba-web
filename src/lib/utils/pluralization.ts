/**
 * Ukrainian pluralization rules
 */
export function pluralizeUk(
  count: number,
  forms: [string, string, string],
): string {
  const absCount = Math.abs(count)
  const lastDigit = absCount % 10
  const lastTwoDigits = absCount % 100

  // Exception for numbers ending in 11-14
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2] // записів
  }

  // For numbers ending in 1
  if (lastDigit === 1) {
    return forms[0] // запис
  }

  // For numbers ending in 2, 3, 4
  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1] // записи
  }

  // For all other cases (0, 5-9, etc.)
  return forms[2] // записів
}
