import config from "@/config";
import { Rating } from "./types";

type SubmitRatingOptions = {
  /** The way ID if the rating is for an existing way. */
  wayId?: number;
  /** The segments if a new way should be created for the rating. */
  segments?: { id: string; start: number; stop: number }[];
  /** API token. */
  token: string;
};

/**
 * Creates a new rating.
 *
 * POSTs it to the /ratings endpoint of the API.
 */
export async function submitRating(
  rating: Omit<Rating, "wayId">,
  options: SubmitRatingOptions,
) {
  const body = {
    way_id: options.wayId || null,
    segments: options.segments || null,
    comment: rating.comment,
    tags: rating.tags,
    ...Object.fromEntries(
      Object.entries(rating.rating).map(([k, v]) => [
        `${k}_rating`,
        Math.round(v / 10),
      ]),
    ),
  };
  try {
    const response = await fetch(`${config.apiURL}/ratings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Response not ok");
    }
  } catch (_e) {
    return false;
  }
  return true;
}
