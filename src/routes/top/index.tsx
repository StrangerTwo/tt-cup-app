import { createFileRoute } from "@tanstack/react-router";

import { useGetMatchFilters, useGetTopMatches } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Match } from "../../api/model";
import { SortMode } from "../../components/icons/SortIcon";
import { Skeleton } from "../../components/lib/Skeleton";
import { useUrlSyncedTableState } from "../../components/lib/useUrlSyncedTableState";
import { MatchRow } from "../../components/match/MatchRow";
import { TopMatchesFilter } from "../../components/match/top/TopMatchesFilter";
import {
    fromMatchFilters,
    topMatchesFilterDefaultValues,
    TopMatchesFilterType,
} from "../../components/match/top/topMatchesFilterSchema";
import { Card } from "../../components/ui/Card";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";

export const Route = createFileRoute("/top/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: defaultFilters } = useGetMatchFilters();
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState<TopMatchesFilterType, Match>({
        tableId: "tournaments",
        defaultSorting: [
            {
                key: "time",
                mode: SortMode.DESC,
            },
        ],
        defaultFilters: defaultFilters ? fromMatchFilters(defaultFilters) : topMatchesFilterDefaultValues,
    });
    const { mutateAsync } = useGetTopMatches();
    const { data, isFetching } = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                // ...filter,
                filters: [
                    {
                        type: "ELO" as const,
                        value: 5,
                    },
                ],
                pageInfo: {
                    ...pageInfo,
                    // sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getTopMatches],
    });

    return (
        <>
            {defaultFilters && <TopMatchesFilter filters={filters} isFetching={isFetching} setFilters={setFilters} />}
            {data ? (
                <div className="mt-2 flex flex-col gap-2 md:mt-4 md:gap-4">
                    {data.map((match) => (
                        <Card key={match._id} className="p-0 md:p-1">
                            <MatchRow.FC match={match} />
                        </Card>
                    ))}
                </div>
            ) : (
                <Skeleton.Card />
            )}
        </>
    );
}
