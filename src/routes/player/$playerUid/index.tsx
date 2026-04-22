import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useGetPlayer } from "../../../api/api";
import { Skeleton } from "../../../components/lib/Skeleton";
import { Tabs } from "../../../components/lib/Tabs";
import { MatchesSummaryCard } from "../../../components/match/MatchesSummaryCard";
import { MatchHistory } from "../../../components/match/MatchHistory";
import { PlayerDataCard } from "../../../components/player/PlayerDataCard";
import { PlayerRivals } from "../../../components/player/rivals/PlayerRivals";

export const Route = createFileRoute("/player/$playerUid/")({
    component: RouteComponent,
    validateSearch: (search) => {
        return {
            tab: search.tab,
        } as {
            tab?: string;
        };
    },
});

function RouteComponent() {
    const navigate = useNavigate();
    const { playerUid } = Route.useParams();
    const search = Route.useSearch();
    const tab = search.tab || "all";

    const { data: player } = useGetPlayer(playerUid);

    const selectTab = (tab: string) => {
        navigate({ to: "/player/$playerUid", params: { playerUid }, search: { tab }, replace: true });
    };

    if (!player) return <Skeleton.Card />;

    return (
        <>
            <h1 className="text-xl">
                {player.name} ({player.uid})
            </h1>
            <PlayerDataCard player={player} />

            <MatchesSummaryCard playerUid={player.uid} className="mt-2 md:mt-4" />
            <Tabs
                tabs={[
                    {
                        header: "Vše",
                        value: "all",
                        content: <MatchHistory playerUid={player.uid} />,
                    },
                    {
                        header: "Soupeři",
                        value: "rivals",
                        content: <PlayerRivals playerUid={player.uid} />,
                    },
                ]}
                value={tab}
                onSelect={selectTab}
            />
        </>
    );
}
