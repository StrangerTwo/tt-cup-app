import { useQueryClient } from "@tanstack/react-query";

import { getGetTournamentQueryKey, getPlaceRecommendations, useGetPlaceRecommendations } from "../../api/api";
import { TournamentFull } from "../../api/model";

export const usePlaceRecommendations = () => {
    const client = useQueryClient();

    return useGetPlaceRecommendations({
        query: {
            queryFn: ({ signal }) =>
                getPlaceRecommendations(undefined, signal).then((res) => {
                    res.forEach((tournament) => {
                        client.setQueryData(
                            getGetTournamentQueryKey(tournament._id),
                            (x: TournamentFull | undefined) => tournament,
                        );
                    });
                    return res;
                }),
        },
    });
};
