import { useNavigate } from "@tanstack/react-router";

import { useGetMatches } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Match } from "../../api/model";
import { sortingForRequest } from "../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";
import { SortMode } from "../icons/SortIcon";
import Table, { Sort } from "../lib/Table";
import { useUrlSyncedTableState } from "../lib/useUrlSyncedTableState";
import { Card } from "../ui/Card";
import { MatchRow } from "./MatchRow";

interface Props {
    playerUid: string;
    rivalUid?: string;
}

export const MatchHistory = ({ playerUid, rivalUid }: Props) => {
    const navigate = useNavigate();

    const { sort, setSort } = useUrlSyncedTableState({
        tableId: "matches",
        defaultSorting: {
            key: "time",
            mode: SortMode.DESC,
        } as Sort<Match>,
    });

    const { mutateAsync } = useGetMatches();
    const { data, isFetching, fetchNextPage } = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                playerUids: [playerUid, rivalUid].filter(Boolean) as Array<string>,
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getMatches, playerUid, rivalUid, sort],
    });

    return (
        <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
            <Table
                caption={
                    <>
                        <h2 className="text-xl">Historie zápasů</h2>
                    </>
                }
                heading={MatchRow.Heading}
                data={data ?? []}
                keyFn={(p) => p._id}
                sort={sort}
                onSort={{
                    time: (mode) => setSort(mode ? { key: "time", mode } : undefined),
                }}
                onRowClick={(match) => {
                    if (match.tournamentId)
                        navigate({ to: "/tournament/$tournamentId", params: { tournamentId: match.tournamentId } });
                }}
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {(match, i) => <MatchRow.FC match={match} playerUid={playerUid} />}
            </Table>
        </Card>
    );
};
