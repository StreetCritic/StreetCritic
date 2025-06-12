import { useLocale } from "@/hooks";

type Props = {
  /** The timestamp to display. */
  value: Date;
};

/**
 * Displays a timestamp in the user's locale.
 */
export default function DateTime({ value }: Props) {
  const locale = useLocale();
  const format = new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  });
  return <time>{format.format(value)}</time>;
}
