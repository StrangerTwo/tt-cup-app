import { createFileRoute } from "@tanstack/react-router";

import { useGetPlayer } from "../../api/api";
import { Skeleton } from "../../components/lib/Skeleton";
import { MatchHistory } from "../../components/matches/MatchHistory";

export const Route = createFileRoute("/player/$playerUid")({
    component: RouteComponent,
});

function RouteComponent() {
    const { playerUid } = Route.useParams();

    const { data: player } = useGetPlayer(playerUid);

    if (!player) return <Skeleton.Card />;

    return (
        <>
            <h1 className="mb-4 text-xl">
                {player.name} ({player.uid})
            </h1>
            <MatchHistory playerUid={player.uid} />
        </>
    );
}
