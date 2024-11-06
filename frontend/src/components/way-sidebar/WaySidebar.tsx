import { useEffect, useState } from "react";
import WayInfo from "@/components/way-info";
import config from "@/config";

type Props = {
  wayId: number;
};

export default function WaySidebar({ wayId }: Props) {
  const [wayData, setWayData] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);

  useEffect(() => {
    (async () => {
      const wayResponse = await fetch(`${config.apiURL}/ways/${wayId}`);
      const way = await wayResponse.json();
      setWayData(way);

      // TODO use cache
      const ratingsResponse = await fetch(
        `${config.apiURL}/ratings?way_id=${wayId}`,
        { cache: "no-store" },
      );
      const ratings = await ratingsResponse.json();
      setRatingsData(ratings);
      console.log(wayId, ratings, `${config.apiURL}/ratings?way_id=${wayId}`);
    })();
  }, [wayId]);

  if (!wayData || !ratingsData) {
    return <p>empty</p>;
  }

  return <WayInfo way={wayData} ratings={ratingsData} />;
}
