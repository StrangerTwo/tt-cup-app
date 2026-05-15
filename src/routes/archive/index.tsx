import { createFileRoute } from "@tanstack/react-router";

import { TournamentFull } from "../../api/model";
import { BetSummaryCard } from "../../components/bet/BetSummaryCard";
import { SortMode } from "../../components/icons/SortIcon";
import { useUrlSyncedTableState } from "../../components/lib/useUrlSyncedTableState";
import { Tournaments } from "../../components/tournaments/tournaments/Tournaments";
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
    const { isFetching } = useTournaments({ ...filters, done: true }, sort);

    return (
        <>
            <Card className="mb-2 md:mb-4">
                <TournamentsFilter filters={filters} setFilters={setFilters} isFetching={isFetching} />
            </Card>
            <BetSummaryCard location={filters.location} className="mb-2 md:mb-4" />
            <Tournaments filters={filters} sort={sort} />
        </>
    );
}
