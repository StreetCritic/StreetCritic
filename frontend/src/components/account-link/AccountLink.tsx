import { Account } from "@/api-bindings/Account";
import { Link } from "@/components";

type Props = {
  account: Account;
  size?: string;
};

/** Username with link to profile. */
export default function AccountLink({ account, size }: Props) {
  return (
    <>
      {(account.name && account.username && (
        <Link size={size} to={`/user/${account.username}`}>
          {account.name}
        </Link>
      )) ||
        account.id.slice(0, 8) + "..."}
    </>
  );
}
