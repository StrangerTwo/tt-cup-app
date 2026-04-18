import { createFileRoute } from "@tanstack/react-router";

import { useGetPlayer } from "../../../../api/api";
import { Skeleton } from "../../../../components/lib/Skeleton";
import { MatchHistory } from "../../../../components/matches/MatchHistory";

export const Route = createFileRoute("/player/$playerUid/vs/$rivalUid")({
    component: RouteComponent,
});

function RouteComponent() {
    const { playerUid, rivalUid } = Route.useParams();
    const { data: player } = useGetPlayer(playerUid);
    const { data: rival } = useGetPlayer(rivalUid);

    if (!player || !rival) return <Skeleton.Card />;

    return (
        <>
            <h1 className="text-xl">
                {player.name} vs {rival.name}
            </h1>
            <p className="mb-2 text-sm italic md:mb-4">
                ({player.uid}) vs ({rival.uid})
            </p>

            <MatchHistory playerUid={player.uid} rivalUid={rival.uid} />
        </>
    );
}
