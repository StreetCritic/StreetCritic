import User, { UserContext } from "@/User";
import { useContext } from "react";

/**
 * Returns the User object.
 */
export default function useUser(): User | null {
  const user = useContext<User | null>(UserContext);
  return user;
}
