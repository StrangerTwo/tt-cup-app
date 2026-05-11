import { twMerge } from "tailwind-merge";

import { useGetSummaryForPlayer, useGetSummaryForRivalry } from "../../api/api";
import { Player } from "../../api/model";
import { isDefined } from "../../lib/utils";
import { RenderItem } from "../lib/RenderItem";
import { Score } from "../lib/Score";
import { Skeleton } from "../lib/Skeleton";
import { Card } from "../ui/Card";

type Props = {
    className?: string;
} & (
    | {
          playerUid: Player["uid"];
          rivalUid: Player["uid"];
      }
    | {
          playerUid: Player["uid"];
          rivalUid?: never;
      }
);

export const MatchesSummaryCard = ({ playerUid, rivalUid, className }: Props) => {
    const isRivalry = isDefined(rivalUid);
    console.log(isRivalry, playerUid, rivalUid);

    const { data: playerSummary } = useGetSummaryForPlayer(playerUid, { query: { enabled: !isRivalry } });
    const { data: rivalrySummary } = useGetSummaryForRivalry(playerUid, rivalUid!, { query: { enabled: isRivalry } });
    const summary = isRivalry ? rivalrySummary : playerSummary;

    if (!summary) {
        return <Skeleton.Card className={className} />;
    }

    return (
        <Card className={twMerge("max-w-md", className)}>
            <dl className="flex flex-col gap-2 md:gap-4">
                <RenderItem title="Celkové zápasy:">
                    <Score scoreA={summary.matchesWon} scoreB={summary.matchesLost} isWinForA />
                </RenderItem>
                <RenderItem title="Poslední řada:">
                    <Score scoreA={summary.currentWinStreak} scoreB={summary.currentLoseStreak} isWinForA />
                </RenderItem>
                <RenderItem title="Nejdelší řada:">
                    <Score scoreA={summary.longestWinStreak} scoreB={summary.longestLoseStreak} isWinForA />
                </RenderItem>
            </dl>
        </Card>
    );
};
