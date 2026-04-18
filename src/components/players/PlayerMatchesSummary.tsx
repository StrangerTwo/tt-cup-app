import { twMerge } from "tailwind-merge";

import { useGetPlayerMatchesSummary } from "../../api/api";
import { Player } from "../../api/model";
import { RenderItem } from "../lib/RenderItem";
import { Score } from "../lib/Score";
import { Skeleton } from "../lib/Skeleton";
import { Card } from "../ui/Card";

interface Props {
    playerUid: Player["uid"];
    className?: string;
}

export const PlayerMatchesSummary = ({ playerUid, className }: Props) => {
    const { data } = useGetPlayerMatchesSummary(playerUid);

    if (!data) {
        return <Skeleton.Card />;
    }

    return (
        <Card className={twMerge(className)}>
            <h2 className="mb-2 text-xl md:mb-4">Shrnutí</h2>

            <dl className="flex flex-col gap-2 md:gap-4">
                <RenderItem title="Celkové zápasy:">
                    <Score scoreA={data.matchesWon} scoreB={data.matchesLost} isWinForA />
                </RenderItem>
                <RenderItem title="Poslední řada:">
                    <Score scoreA={data.currentWinStreak} scoreB={data.currentLoseStreak} isWinForA />
                </RenderItem>
                <RenderItem title="Nejdelší řada:">
                    <Score scoreA={data.longestWinStreak} scoreB={data.longestLoseStreak} isWinForA />
                </RenderItem>
            </dl>
        </Card>
    );
};
