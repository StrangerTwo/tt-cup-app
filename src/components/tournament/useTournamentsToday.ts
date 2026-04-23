import { useQueryClient } from "@tanstack/react-query";

import { getGetPlaceQueryKey, getGetTournamentQueryKey, useGetTournamentsToday } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { GetTournamentsRequest, Place, PlaceTournamentMatches, TournamentFull } from "../../api/model";
import { sortingForRequest } from "../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";
import { Sort } from "../lib/Table";

export const useTournamentsToday = (
    filter: Omit<GetTournamentsRequest, "pageInfo"> | undefined,
    sort?: Sort<PlaceTournamentMatches>,
) => {
    const client = useQueryClient();
    const { mutateAsync } = useGetTournamentsToday();
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
        queryKey: [EQueryKey.getTournamentsToday],
        onfulfilled: (res) => {
            res.results.forEach(({ place, tournament, matches }) => {
                client.setQueryData(getGetPlaceQueryKey(place.uid), (x: Place | undefined) => place);
                if (tournament)
                    client.setQueryData(
                        getGetTournamentQueryKey(tournament._id),
                        (t: TournamentFull | undefined): TournamentFull => ({ ...tournament, matches: matches }),
                    );
            });
        },
    });
};
