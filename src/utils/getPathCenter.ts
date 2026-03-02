/**
 * Compute the bounding-box center of an SVG path `d` string.
 * Returns { x, y, width, height } where x/y is the center.
 */
export function getPathCenter(d: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  // Extract all numbers from the path data.
  // SVG path coordinates appear as pairs (x,y) after commands.
  const nums = d.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 2) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = parseFloat(nums[i]);
    const y = parseFloat(nums[i + 1]);
    if (isFinite(x) && isFinite(y)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    x: minX + width / 2,
    y: minY + height / 2,
    width,
    height,
  };
}
