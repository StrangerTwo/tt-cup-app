import { useQueryClient } from "@tanstack/react-query";

import { getGetPlayerQueryKey, useGetPlayerRivals } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { GetPlayerRivalsRequest, Player, RivalMatchesSummary } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";

export const usePlayerRivals = (
    playerUid: Player["uid"],
    filter: Omit<GetPlayerRivalsRequest, "pageInfo"> | undefined,
    sort?: Array<Sort<RivalMatchesSummary>>,
) => {
    const client = useQueryClient();
    const { mutateAsync } = useGetPlayerRivals();
    return usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            playerUid,
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
        queryKey: [EQueryKey.getPlayerRivals, playerUid, filter, sort],
        onfulfilled: (res) => {
            res.results.forEach(({ rivalUid, rival }) => {
                client.setQueryData(getGetPlayerQueryKey(rivalUid), (x: Player | undefined | null) => rival ?? null);
            });
        },
    });
};
