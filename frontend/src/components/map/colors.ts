import chroma from "chroma-js";

/**
 * Returns the scale for the rating colors.
 */
export function ratingScale() {
  return chroma.scale(["ffffff", "ff7b00"]);
}

/**
 * Returns an array of the rating colors.
 */
export function ratingColors() {
  const colors = [];
  const scale = ratingScale();
  for (let i = 0; i <= 10; i++) {
    colors.push(i);
    colors.push(
      scale(i / 10)
        .brighten(1)
        .hex(),
    );
  }
  return colors;
}
