import { createFileRoute } from "@tanstack/react-router";

import { Skeleton } from "../../components/lib/Skeleton";
import { TournamentCard } from "../../components/tournaments/TournamentCard";
import { useTournament } from "../../components/tournaments/useTournament";
import { renderFullDate, renderHoursShort } from "../../lib/date";

export const Route = createFileRoute("/tournament/$tournamentId")({
    component: RouteComponent,
});

function RouteComponent() {
    const { tournamentId } = Route.useParams();
    const { data } = useTournament(tournamentId);

    if (!data) return <Skeleton.Card />;
    const { tournament, matches } = data;

    return (
        <>
            <h1 className="text-xl">
                Turnaj {tournament.place} | {renderFullDate(tournament.date)} |{" "}
                <span className="whitespace-nowrap">
                    {matches.at(0) && renderHoursShort(matches.at(0)!.time)} -{" "}
                    {matches.at(-1) && renderHoursShort(matches.at(-1)!.time)}
                </span>
            </h1>
            <p className="mb-2 text-sm italic md:mb-4">{tournament._id}</p>

            <TournamentCard tournamentId={tournamentId} />
        </>
    );
}
