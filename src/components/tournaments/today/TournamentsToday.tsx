import { TournamentToday } from "../../../api/model";
import { SortMode } from "../../icons/SortIcon";
import { Skeleton } from "../../lib/Skeleton";
import { Sort } from "../../lib/Table";
import { useLoadMoreSentinel } from "../../lib/useLoadMoreSentinel";
import { useUrlSyncedTableState } from "../../lib/useUrlSyncedTableState";
import { Card } from "../../ui/Card";
import { TournamentCard } from "../TournamentCard";
import { TournamentsFilter } from "./TournamentsFilter";
import { useTournamentsToday } from "./useTournamentsToday";

export const TournamentsToday = () => {
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState({
        tableId: "tournamentsToday",
        defaultSorting: {
            key: "place.location",
            mode: SortMode.DESC,
        } as Sort<TournamentToday>,
    });
    const { data, isFetching, fetchNextPage } = useTournamentsToday(filters, sort);

    const { sentinelRef } = useLoadMoreSentinel<HTMLDivElement>(data, fetchNextPage, isFetching);

    return (
        <>
            <Card className="mb-2 md:mb-4">
                <TournamentsFilter filters={filters} setFilters={setFilters} isFetching={isFetching} />
            </Card>
            {data ? (
                <>
                    <div className="flex flex-col gap-2 md:gap-4">
                        {data.map(({ place, tournament, matches }) => (
                            <TournamentCard
                                key={place.uid}
                                tournamentId={tournament?._id}
                                place={place}
                                date={new Date().toISOString().slice(0, 10)}
                            />
                        ))}
                    </div>

                    <div ref={sentinelRef} />
                </>
            ) : (
                <Skeleton.Card />
            )}
        </>
    );
};
