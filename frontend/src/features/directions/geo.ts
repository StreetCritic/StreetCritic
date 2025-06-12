/**
 * Calculates gains (up and down) based on heights array ([position, height])
 */
export function heightsToGains(heights: [number, number][]): [number, number] {
  return heights
    .reduce(
      ([lastHeight, sumUp, sumDown], [_, height]) => [
        height,
        height > lastHeight ? sumUp + height - lastHeight : sumUp,
        height < lastHeight ? sumDown + lastHeight - height : sumDown,
      ],
      [heights[0][1], 0, 0],
    )
    .slice(1, 3) as [number, number];
}
