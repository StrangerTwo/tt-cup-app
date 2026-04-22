import { useQueryClient } from "@tanstack/react-query";

import { getGetTournamentQueryKey, useGetPlaceRecommendations } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { GetPlaceRecommendationsRequest, TournamentFull } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";

export const usePlaceRecommendations = (
    filter: Omit<GetPlaceRecommendationsRequest, "pageInfo"> | undefined,
    sort?: Sort<TournamentFull>,
) => {
    const client = useQueryClient();
    const { mutateAsync } = useGetPlaceRecommendations();
    return usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                ...filter,
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getPlaceRecommendations, filter, sort],
        onfulfilled: (res) => {
            res.results.forEach((tournament) => {
                client.setQueryData(
                    getGetTournamentQueryKey(tournament._id),
                    (x: TournamentFull | undefined) => tournament,
                );
            });
        },
    });
};
