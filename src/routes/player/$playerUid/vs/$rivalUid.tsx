import { createFileRoute } from "@tanstack/react-router";

import { useGetPlayer, useGetPlayerRival } from "../../../../api/api";
import { Skeleton } from "../../../../components/lib/Skeleton";
import { MatchHistory } from "../../../../components/matches/MatchHistory";
import { MatchesSummaryCard } from "../../../../components/players/MatchesSummaryCard";
import { RivalInfoCard } from "../../../../components/players/RivalInfoCard";

export const Route = createFileRoute("/player/$playerUid/vs/$rivalUid")({
    component: RouteComponent,
});

function RouteComponent() {
    const { playerUid, rivalUid } = Route.useParams();
    const { data: player } = useGetPlayer(playerUid);
    const { data: rival } = useGetPlayer(rivalUid);
    const { data: summary } = useGetPlayerRival(playerUid, rivalUid);

    return (
        <>
            <h1 className="text-xl">
                {player?.name} vs {rival?.name}
            </h1>
            <p className="mb-2 text-sm italic md:mb-4">
                ({playerUid}) vs ({rivalUid})
            </p>

            <div className="mb-2 flex flex-col gap-2 md:mb-4 md:flex-row md:gap-4">
                {player ? <RivalInfoCard player={player} /> : <Skeleton.Card />}
                {rival ? <RivalInfoCard player={rival} /> : <Skeleton.Card />}
            </div>

            {summary ? (
                <MatchesSummaryCard summary={summary.matchesSummary} className="mb-2 md:mb-4" />
            ) : (
                <Skeleton.Card />
            )}

            <MatchHistory playerUid={(player?.uid ?? rival?.uid) as string} rivalUid={rival?.uid} />
        </>
    );
}
