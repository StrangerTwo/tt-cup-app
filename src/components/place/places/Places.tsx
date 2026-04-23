import { Place } from "../../../api/model";
import { SortMode } from "../../icons/SortIcon";
import Table, { Sort } from "../../lib/Table";
import { useUrlSyncedTableState } from "../../lib/useUrlSyncedTableState";
import { Card } from "../../ui/Card";
import { PlaceFilter } from "./PlaceFilter";
import { PlaceRow } from "./PlaceRow";
import { usePlaces } from "./usePlaces";

export const Places = () => {
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState({
        tableId: "places",
        defaultSorting: {
            key: "uid",
            mode: SortMode.DESC,
        } as Sort<Place>,
    });
    const { data, isFetching, fetchNextPage } = usePlaces(filters, sort);

    return (
        <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
            <Table
                caption={
                    <>
                        <div className="mb-1 flex items-center gap-4 md:mb-4">
                            <h1 className="text-xl">Haly</h1>
                        </div>
                        <PlaceFilter filters={filters} setFilters={setFilters} isFetching={isFetching} />
                    </>
                }
                heading={PlaceRow.Heading}
                data={data ?? []}
                keyFn={(p) => p.uid}
                sort={sort}
                onSort={Object.fromEntries(
                    (["uid", "location", "lastUpdate"] as Array<keyof Place>).map((x) => [
                        x,
                        (mode: SortMode | null) => setSort(mode ? { key: x, mode } : undefined),
                    ]),
                )}
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {(p, i) => <PlaceRow.FC placeUid={p.uid} i={i} />}
            </Table>
        </Card>
    );
};
