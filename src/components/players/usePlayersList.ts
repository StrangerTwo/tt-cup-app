import { useQueryClient } from "@tanstack/react-query";

import { getGetPlayerQueryKey, useGetPlayers } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Player } from "../../api/model";
import { sortingForRequest } from "../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";
import { Sort } from "../lib/Table";
import { PlayersFilterFormType } from "./playersFilterSchema";

export const usePlayersList = (playersFilter: PlayersFilterFormType | undefined, sort: Sort<Player> | undefined) => {
    const client = useQueryClient();
    const { mutateAsync } = useGetPlayers();
    const result = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                ...playersFilter,
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getPlayers, playersFilter, sort],
        onfulfilled: (res) => {
            res.results.forEach((player) => {
                client.setQueryData(getGetPlayerQueryKey(player.uid), (x: Player | undefined) => player);
            });
        },
    });

    return result;
};
