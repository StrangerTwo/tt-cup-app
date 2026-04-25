import { TournamentToday } from "../../../api/model";
import { SortMode } from "../../icons/SortIcon";
import { Skeleton } from "../../lib/Skeleton";
import { useLoadMoreSentinel } from "../../lib/useLoadMoreSentinel";
import { useUrlSyncedTableState } from "../../lib/useUrlSyncedTableState";
import { Card } from "../../ui/Card";
import { TournamentCard } from "../TournamentCard";
import { TournamentsFilter } from "./TournamentsFilter";
import { TournamentsFilterType } from "./tournamentsFilterSchema";
import { useTournamentsToday } from "./useTournamentsToday";

export const TournamentsToday = () => {
    const {
        sort,
        setSort,
        filters: _filters,
        setFilters,
    } = useUrlSyncedTableState<TournamentsFilterType, TournamentToday>({
        tableId: "tournamentsToday",
        defaultSorting: {
            key: "place.location",
            mode: SortMode.DESC,
        },
    });
    const { finished, ...filters } = _filters;
    const { data, isFetching, fetchNextPage } = useTournamentsToday(
        { ...filters, done: finished ? undefined : false },
        sort,
    );

    const { sentinelRef } = useLoadMoreSentinel<HTMLDivElement>(data, fetchNextPage, isFetching);

    return (
        <>
            <Card className="mb-2 md:mb-4">
                <TournamentsFilter filters={_filters} setFilters={setFilters} isFetching={isFetching} />
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
