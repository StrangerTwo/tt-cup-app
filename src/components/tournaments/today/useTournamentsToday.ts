import { useQueryClient } from "@tanstack/react-query";

import {
    getGetBetQueryKey,
    getGetPlaceQueryKey,
    getGetTournamentQueryKey,
    useGetTournamentsToday,
} from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { Bet, GetTournamentsRequest, Place, TournamentFull, TournamentToday } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";

export const useTournamentsToday = (
    filter: Omit<GetTournamentsRequest, "pageInfo"> | undefined,
    sort?: Sort<TournamentToday>,
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
        queryKey: [EQueryKey.getTournamentsToday, filter, sort],
        onfulfilled: (res) => {
            console.log("HERE");
            res.results.forEach(({ place, tournament, matches, bets }) => {
                client.setQueryData(getGetPlaceQueryKey(place.uid), (x: Place | undefined) => place);
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
