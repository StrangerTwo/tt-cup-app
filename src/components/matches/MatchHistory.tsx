import { useState } from "react";

import { useGetMatches } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Match } from "../../api/model";
import { sortingForRequest } from "../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";
import { SortMode } from "../icons/SortIcon";
import Table, { Sort } from "../lib/Table";
import { Card } from "../ui/Card";
import { MatchRow } from "./MatchRow";

interface Props {
    playerUid: string;
}

export const MatchHistory = ({ playerUid }: Props) => {
    const [sort, setSort] = useState<Sort<Match> | undefined>({
        key: "time",
        mode: SortMode.DESC,
    });

    const { mutateAsync } = useGetMatches();
    const { data, isFetching, fetchNextPage } = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                playerUid,
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getMatches, playerUid, sort],
    });

    return (
        <Card className="w-0 min-w-full overflow-x-auto p-0 md:p-0">
            <Table
                caption={
                    <>
                        <h2 className="text-xl">Historie zápasů</h2>
                    </>
                }
                heading={MatchRow.Heading}
                data={data ?? []}
                keyFn={(p) => p.objectId}
                sort={sort}
                onSort={{
                    time: (mode) => setSort(mode ? { key: "time", mode } : undefined),
                }}
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {(match, i) => <MatchRow.FC match={match} playerUid={playerUid} />}
            </Table>
        </Card>
    );
};
