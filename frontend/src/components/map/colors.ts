import chroma from "chroma-js";

/**
 * Returns the scale for the rating colors.
 */
export function ratingScale() {
  return chroma.scale("Spectral");
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
