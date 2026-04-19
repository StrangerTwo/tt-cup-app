import { createFileRoute } from "@tanstack/react-router";

import { useGetPlayer, useGetPlayerRivals } from "../../../../api/api";
import { Skeleton } from "../../../../components/lib/Skeleton";
import { MatchHistory } from "../../../../components/matches/MatchHistory";
import { MatchesSummaryCard } from "../../../../components/players/MatchesSummaryCard";

export const Route = createFileRoute("/player/$playerUid/vs/$rivalUid")({
    component: RouteComponent,
});

function RouteComponent() {
    const { playerUid, rivalUid } = Route.useParams();
    const { data: player } = useGetPlayer(playerUid);
    const { data: rival } = useGetPlayer(rivalUid);
    const { data: summary } = useGetPlayerRivals(playerUid, {
        query: { select: (res) => res.find((summary) => summary.rivalUid === rivalUid) },
    });

    if (!player || !rival || !summary) return <Skeleton.Card />;

    return (
        <>
            <h1 className="text-xl">
                {player.name} vs {rival.name}
            </h1>
            <p className="mb-2 text-sm italic md:mb-4">
                ({player.uid}) vs ({rival.uid})
            </p>

            <MatchesSummaryCard summary={summary} className="mb-2 md:mb-4" />

            <MatchHistory playerUid={player.uid} rivalUid={rival.uid} />
        </>
    );
}
