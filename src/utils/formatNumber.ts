/**
 * Formats a number using US locale for better readability.
 * @param {number} number - The number to format.
 * @returns {string} The formatted number string.
 */
export function formatNumber(number: number): string {
  return number.toLocaleString("en-US");
}
