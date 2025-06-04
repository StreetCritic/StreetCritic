import config from "@/config";

/**
 * Updates user db.
 *
 * POSTs it to the /accounts endpoint of the API.
 */
export async function updateAccount(token: string) {
  try {
    const response = await fetch(`${config.apiURL}/accounts`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Response not ok");
    }
  } catch (_e) {
    return false;
  }
  return true;
}
