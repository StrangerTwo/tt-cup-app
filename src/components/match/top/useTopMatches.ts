import { useQueryClient } from "@tanstack/react-query";

import {
    getGetBetQueryKey,
    getGetPlayerQueryKey,
    getGetSummaryForPlayerQueryKey,
    getGetSummaryForRivalryQueryKey,
    useGetTopMatches,
} from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { Bet, Player, Summary, TopMatch } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";
import { toMatchFilters, TopMatchesFilterType } from "./topMatchesFilterSchema";

export const useTopMatches = (filter?: TopMatchesFilterType, sort?: Array<Sort<TopMatch>>) => {
    const client = useQueryClient();

    const { mutateAsync } = useGetTopMatches();
    return usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                filters: toMatchFilters(filter!),
                done: false,
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest(sort) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getTopMatches, filter, sort],
        onfulfilled: (res) => {
            res.results.forEach(({ match, bet }) => {
                client.setQueryData(
                    getGetBetQueryKey(match._id),
                    (b: Bet | null | undefined): Bet | null => bet ?? null,
                );
            });
            const playerUids = res.results.map((x) => x.match).flatMap((x) => x.playerUids);
            playerUids.forEach((playerUid) => {
                client.setQueryData(
                    getGetPlayerQueryKey(playerUid),
                    (p: Player | null | undefined): Player | null =>
                        res.players.find((x) => x.uid === playerUid) ?? null,
                );
            });
            res.summaries.forEach((summary) => {
                if (summary.rivalUid)
                    client.setQueryData(
                        getGetSummaryForRivalryQueryKey(summary.playerUid, summary.rivalUid),
                        (s: Summary | undefined): Summary => summary,
                    );
                else
                    client.setQueryData(
                        getGetSummaryForPlayerQueryKey(summary.playerUid),
                        (s: Summary | undefined): Summary => summary,
                    );
            });
        },
    });
};
