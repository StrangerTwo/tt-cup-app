import { createFileRoute, Link } from "@tanstack/react-router";

import { useGetPlayer } from "../../../../api/api";
import { MatchesSummaryCard } from "../../../../components/match/MatchesSummaryCard";
import { MatchHistory } from "../../../../components/match/MatchHistory";
import { RivalInfoCard } from "../../../../components/player/rivals/RivalInfoCard";

export const Route = createFileRoute("/player/$playerUid/vs/$rivalUid")({
    component: RouteComponent,
});

function RouteComponent() {
    const { playerUid, rivalUid } = Route.useParams();
    const { data: player } = useGetPlayer(playerUid);
    const { data: rival } = useGetPlayer(rivalUid);

    return (
        <>
            <h1 className="text-xl">
                {player?.name} vs {rival?.name}
            </h1>
            <p className="mb-2 text-sm italic md:mb-4">
                (
                <Link to="/player/$playerUid" params={{ playerUid }} className="underline decoration-dotted">
                    {playerUid}
                </Link>
                ) vs (
                <Link to="/player/$playerUid" params={{ playerUid: rivalUid }} className="underline decoration-dotted">
                    {rivalUid}
                </Link>
                )
            </p>

            <div className="mb-2 flex flex-col gap-2 md:mb-4 md:flex-row md:gap-4">
                <RivalInfoCard playerUid={playerUid} />
                <RivalInfoCard playerUid={rivalUid} />
            </div>

            <MatchesSummaryCard playerUid={playerUid} rivalUid={rivalUid} className="mb-2 md:mb-4" />

            <MatchHistory playerUid={playerUid} rivalUid={rivalUid} />
        </>
    );
}
