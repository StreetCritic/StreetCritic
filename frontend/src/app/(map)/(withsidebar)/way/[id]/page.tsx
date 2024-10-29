import type { Metadata } from "next";
import WayInfo from "@/components/way-info";

export const dynamic = "force-dynamic";

export default async function Home({ params }) {
  const wayResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_URL || "") + `/ways/${params.id}`,
  );
  const way = await wayResponse.json();

  // TODO use cache
  const ratingsResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_URL || "") + `/ratings?way_id=${params.id}`,
    { cache: "no-store" },
  );
  const ratings = await ratingsResponse.json();
  console.log(
    params.id,
    ratings,
    (process.env.NEXT_PUBLIC_API_URL || "") + `/ratings?way_id=${params.id}`,
  );

  return <WayInfo way={way} ratings={ratings} />;
}
