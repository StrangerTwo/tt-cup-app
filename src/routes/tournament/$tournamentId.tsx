import { createFileRoute } from "@tanstack/react-router";

import { useGetTournament } from "../../api/api";
import { LinkIcon } from "../../components/icons";
import { Skeleton } from "../../components/lib/Skeleton";
import Table from "../../components/lib/Table";
import { MatchRow } from "../../components/matches/MatchRow";
import { Card } from "../../components/ui/Card";
import { IconButton } from "../../components/ui/IconButton";
import { renderFullDate, renderHoursShort } from "../../lib/date";

export const Route = createFileRoute("/tournament/$tournamentId")({
    component: RouteComponent,
});

function RouteComponent() {
    const { tournamentId } = Route.useParams();
    const { data: tournament } = useGetTournament(tournamentId);

    if (!tournament) return <Skeleton.Card />;

    return (
        <>
            <h1 className="text-xl">
                Turnaj {tournament.place} | {renderFullDate(tournament.date)} |{" "}
                <span className="whitespace-nowrap">
                    {renderHoursShort(tournament.matches.at(0)!.time)} -{" "}
                    {renderHoursShort(tournament.matches.at(-1)!.time)}
                </span>
            </h1>
            <p className="mb-2 text-sm italic md:mb-4">{tournament._id}</p>

            <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
                <Table
                    caption={
                        <div className="flex items-center gap-2 md:gap-4">
                            <h2 className="text-xl">Zápasy</h2>
                            <a href="https://ttcup.com/schedule/19.04.2026/h:51/">
                                <IconButton>
                                    <LinkIcon />
                                </IconButton>
                            </a>
                        </div>
                    }
                    heading={MatchRow.Heading}
                    data={tournament.matches}
                    keyFn={(p) => p._id}>
                    {(match, i) => <MatchRow.FC match={match} />}
                </Table>
            </Card>
        </>
    );
}
