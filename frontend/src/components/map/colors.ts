import chroma from "chroma-js";

/**
 * Returns the scale for the rating colors.
 */
export function ratingScale() {
  return chroma.scale([
    "fff7ec",
    "fee8c8",
    "fdd49e",
    "fdbb84",
    "fc8d59",
    "ef6548",
    "d7301f",
    "b30000",
    "7f0000",
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
