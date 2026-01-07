/**
 * Generates an ASCII histogram from an array of times.
 * @param {number[]} times - Array of times in milliseconds.
 * @param {object} options - Configuration options.
 * @param {number} [options.bins=6] - Number of bins for the histogram.
 * @returns {string} ASCII histogram string.
 */
export function generateHistogram(times: number[], options: { bins?: number } = {}): string {
  const { bins = 6 } = options;

  if (times.length === 0) {
    console.log("No data to generate histogram.");
    return "";
  }

  const min = Math.min(...times);
  const max = Math.max(...times);
  const binSize = (max - min) / bins || 1;

  const histData = Array.from({ length: bins }, () => 0);

  // Count frequencies
  times.forEach(t => {
    const bin = Math.min(Math.floor((t - min) / binSize), bins - 1);
    histData[bin] = (histData[bin] || 0) + 1;
  });

  const maxCount = Math.max(...histData);
  const barWidth = 40;

  // Precalculate all ranges as strings
  const ranges: string[] = [];
  for (let i = 0; i < bins; i++) {
    const start = (min + i * binSize).toFixed(2);
    const end = (min + (i + 1) * binSize).toFixed(2);
    ranges.push(`${start}–${end}`);
  }

  // Calculate the maximum range text width
  const maxRangeLength = ranges.reduce<number>((a, b) => Math.max(a, b.length), 0);

  let output = "";

  for (let i = 0; i < bins; i++) {
    const range = (ranges[i] || "").padEnd(maxRangeLength, " ");

    const count = histData[i] || 0;
    const barLength = Math.round((count / maxCount) * barWidth);
    const bar = "█".repeat(barLength);

    output += `${range} | ${bar} ${count}\n`;
  }

  return output;
}
