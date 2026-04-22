import { useQueryClient } from "@tanstack/react-query";

import { Tournament } from "../../../api/model";
import { SortMode } from "../../icons/SortIcon";
import Table, { Sort } from "../../lib/Table";
import { useUrlSyncedTableState } from "../../lib/useUrlSyncedTableState";
import { Card } from "../../ui/Card";
import { PlaceRecommendationRow } from "./PlaceRecommendationRow";
import { PlaceRecommendationsFilter } from "./PlaceRecommendationsFilter";
import { usePlaceRecommendations } from "./usePlaceRecommendations";

export const PlaceRecommendations = () => {
    const client = useQueryClient();
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState({
        tableId: "playerRivals",
        defaultSorting: {
            key: "date",
            mode: SortMode.DESC,
        } as Sort<Tournament>,
    });
    const { data: recommendations, isFetching } = usePlaceRecommendations(filters, sort);

    return (
        <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
            <Table
                caption={
                    <>
                        <>
                            <h1 className="mb-1 text-xl md:mb-4">Přidání stolů</h1>
                            <PlaceRecommendationsFilter
                                filters={filters}
                                setFilters={setFilters}
                                isFetching={isFetching}
                            />
                        </>
                    </>
                }
                heading={PlaceRecommendationRow.Heading}
                sort={sort}
                onSort={Object.fromEntries(
                    (["place", "date"] as Array<keyof Tournament>).map((x) => [
                        x,
                        (mode: SortMode | null) => setSort(mode ? { key: x, mode } : undefined),
                    ]),
                )}
                data={recommendations ?? []}
                keyFn={(p) => p._id}
                expandRow={(t) => <PlaceRecommendationRow.ExpandRowFC tournament={t} />}
                isPending={isFetching}>
                {(t, i, selected) => <PlaceRecommendationRow.FC tournamentId={t._id} selected={selected} />}
            </Table>
        </Card>
    );
};
