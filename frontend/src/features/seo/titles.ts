import slugify from "slugify";

/**
 * Converts string to slug.
 */
export function toSlug(input: string): string {
  return slugify(input, {
    lower: true,
    strict: true,
  });
}
