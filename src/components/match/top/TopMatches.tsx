import { useNavigate } from "@tanstack/react-router";

import { MatchFilter, TopMatch } from "../../../api/model";
import { SortMode } from "../../icons/SortIcon";
import Table, { Sort } from "../../lib/Table";
import { useUrlSyncedTableState } from "../../lib/useUrlSyncedTableState";
import { Card } from "../../ui/Card";
import { TopMatchesFilter } from "./TopMatchesFilter";
import { fromMatchFilters, TopMatchesFilterType } from "./topMatchesFilterSchema";
import { TopMatchRow } from "./TopMatchRow";
import { useTopMatches } from "./useTopMatches";

interface Props {
    defaultFilters: Array<MatchFilter>;
}

export const TopMatches = ({ defaultFilters }: Props) => {
    const navigate = useNavigate();
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState<TopMatchesFilterType, TopMatch>({
        tableId: "tournaments",
        defaultSorting: [
            {
                key: "match.time",
                mode: SortMode.ASC,
            },
        ],
        defaultFilters: fromMatchFilters(defaultFilters),
    });
    const { data: matches, isFetching, fetchNextPage, failureReason } = useTopMatches(filters, sort);

    return (
        <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
            <Table
                caption={
                    <>
                        {defaultFilters && (
                            <TopMatchesFilter filters={filters} isFetching={isFetching} setFilters={setFilters} />
                        )}
                    </>
                }
                heading={TopMatchRow.Heading}
                data={matches ?? []}
                keyFn={({ match }) => match._id}
                sort={sort?.[0]}
                onSort={Object.fromEntries(
                    (["match.time"] as Array<Sort<TopMatch>["key"]>).map((x) => [
                        x,
                        (mode: SortMode | null) => setSort(mode ? [{ key: x, mode }] : undefined),
                    ]),
                )}
                onRowClick={({ match }) =>
                    navigate({ to: "/tournament/$tournamentId", params: { tournamentId: match.tournamentId } })
                }
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {(m, i) => <TopMatchRow.FC topMatch={m} />}
            </Table>
        </Card>
    );
};
