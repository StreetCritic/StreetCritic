import chroma from "chroma-js";

/**
 * Returns the scale for the rating colors.
 */
export function ratingScale() {
  return chroma.scale([
    "fff5eb",
    "fee6ce",
    "fdd0a2",
    "fdae6b",
    "fd8d3c",
    "f16913",
    "d94801",
    "a63603",
    "7f2704",
  ]);
}

/**
 * Returns an array of the rating colors.
 */
export function ratingColors() {
  const colors = [];
  const scale = ratingScale();
  for (let i = 0; i <= 10; i++) {
    colors.push(i);
    colors.push(scale(i / 10).hex());
  }
  return colors;
}
