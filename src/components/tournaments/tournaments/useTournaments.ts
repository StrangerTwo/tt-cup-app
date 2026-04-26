import { useQueryClient } from "@tanstack/react-query";

import { getGetBetQueryKey, getGetPlaceQueryKey, getGetTournamentQueryKey, useGetTournaments } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { Bet, GetTournamentsRequest, Place, TournamentFull } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";

export const useTournaments = (
    filter: Omit<GetTournamentsRequest, "pageInfo"> | undefined,
    sort?: Array<Sort<TournamentFull>>,
) => {
    const client = useQueryClient();
    const { mutateAsync } = useGetTournaments();
    return usePaginatedQuery({
        initialPagination: { size: 10, page: 0 },
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                ...filter,
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest(sort) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getTournamentsToday, filter, sort],
        onfulfilled: (res) => {
            res.results.forEach(({ place, tournament, matches, bets }) => {
                if (place) client.setQueryData(getGetPlaceQueryKey(place.uid), (x: Place | undefined) => place);
                if (tournament)
                    client.setQueryData(
                        getGetTournamentQueryKey(tournament._id),
                        (t: TournamentFull | undefined): TournamentFull => ({ place, tournament, matches, bets }),
                    );
                matches.forEach((match) => {
                    client.setQueryData(
                        getGetBetQueryKey(match._id),
                        (b: Bet | null | undefined): Bet | null => bets.find((x) => x.matchId === match._id) ?? null,
                    );
                });
            });
        },
    });
};
