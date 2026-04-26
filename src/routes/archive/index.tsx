import { createFileRoute } from "@tanstack/react-router";

import { TournamentFull } from "../../api/model";
import { SortMode } from "../../components/icons/SortIcon";
import { Skeleton } from "../../components/lib/Skeleton";
import { useLoadMoreSentinel } from "../../components/lib/useLoadMoreSentinel";
import { useUrlSyncedTableState } from "../../components/lib/useUrlSyncedTableState";
import { TournamentCard } from "../../components/tournaments/TournamentCard";
import { TournamentsFilter } from "../../components/tournaments/tournaments/TournamentsFilter";
import { TournamentsFilterType } from "../../components/tournaments/tournaments/tournamentsFilterSchema";
import { useTournaments } from "../../components/tournaments/tournaments/useTournaments";
import { Card } from "../../components/ui/Card";

export const Route = createFileRoute("/archive/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState<TournamentsFilterType, TournamentFull>({
        tableId: "tournaments",
        defaultSorting: [
            {
                key: "tournament.date",
                mode: SortMode.DESC,
            },
            {
                key: "place.startTime",
                mode: SortMode.DESC,
            },
        ],
    });
    const { data, isFetching, fetchNextPage } = useTournaments({ ...filters, done: true }, sort);

    const { sentinelRef } = useLoadMoreSentinel<HTMLDivElement>(data, fetchNextPage, isFetching);

    return (
        <>
            <Card className="mb-2 md:mb-4">
                <TournamentsFilter filters={{}} setFilters={setFilters} isFetching={isFetching} />
            </Card>
            {data ? (
                <>
                    <div className="mb-32 flex flex-col gap-2 md:gap-4">
                        {data.map(({ place, tournament, matches }) => (
                            <TournamentCard key={tournament._id} tournamentId={tournament?._id} />
                        ))}
                        {isFetching && <Skeleton.Card />}
                    </div>

                    <div ref={sentinelRef} />
                </>
            ) : (
                <Skeleton.Card />
            )}
        </>
    );
}
