import { Box } from "@mantine/core";
import WayInfo from "@/components/way-info";
import Loader from "@/components/loader";
import { api, useGetRatingsByWayIdQuery, useGetWayQuery } from "@/services/api";
import { useAppDispatch } from "@/hooks";

type Props = {
  wayId: number;
};

export default function WaySidebar({ wayId }: Props) {
  const dispatch = useAppDispatch();
  const way = useGetWayQuery({ id: wayId, includeUser: true });
  const ratings = useGetRatingsByWayIdQuery({ id: wayId, includeUsers: true });

  if (way.isFetching || ratings.isFetching) {
    return <Loader />;
  }

  if (!way.data || !ratings.data) {
    return;
  }

  return (
    <Box p="sm">
      <WayInfo
        way={way.data}
        ratings={ratings.data}
        onRefresh={() =>
          dispatch(api.util.invalidateTags([{ type: "Rating" }]))
        }
      />
    </Box>
  );
}
