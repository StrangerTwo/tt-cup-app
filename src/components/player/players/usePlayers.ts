import { useQueryClient } from "@tanstack/react-query";

import { getGetPlayerQueryKey, getGetSummaryForPlayerQueryKey, useGetPlayers } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { GetPlayersRequest, Player, PlayerSummary, Summary } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";

export const usePlayers = (
    filter: Omit<GetPlayersRequest, "pageInfo"> | undefined,
    sort?: Array<Sort<PlayerSummary>>,
) => {
    const client = useQueryClient();
    const { mutateAsync } = useGetPlayers();
    const result = usePaginatedQuery({
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
        queryKey: [EQueryKey.getPlayers, filter, sort],
        onfulfilled: (res) => {
            res.results.forEach(({ player, summary }) => {
                client.setQueryData(getGetPlayerQueryKey(player.uid), (x: Player | undefined) => player);
                client.setQueryData(getGetSummaryForPlayerQueryKey(player.uid), (x: Summary | undefined) => summary);
            });
        },
    });

    return result;
};
