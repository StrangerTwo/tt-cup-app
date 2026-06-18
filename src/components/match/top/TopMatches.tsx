import { MatchFilter, TopMatch } from "../../../api/model";
import { SortMode } from "../../icons/SortIcon";
import Table from "../../lib/Table";
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
    const { filters, setFilters } = useUrlSyncedTableState<TopMatchesFilterType, TopMatch>({
        tableId: "tournaments",
        defaultFilters: {
            ...fromMatchFilters(defaultFilters),
            done: false,
        },
    });
    const sort = [
        {
            key: "match.time" as const,
            mode: filters.done ? SortMode.DESC : SortMode.ASC,
        },
    ];
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
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {(m, i) => <TopMatchRow.FC topMatch={m} />}
            </Table>
        </Card>
    );
};
