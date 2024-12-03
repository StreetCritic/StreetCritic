import User, { UserContext } from "@/User";
import { useContext } from "react";

/**
 * Returns the User object.
 */
export default function useUser(): User {
  const user = useContext<User | null>(UserContext);
  if (user === null) {
    throw new Error("User not initialized");
  }
  return user;
}
