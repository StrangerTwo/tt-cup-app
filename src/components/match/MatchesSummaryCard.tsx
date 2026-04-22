import { twMerge } from "tailwind-merge";

import { useGetPlayerMatchesSummary } from "../../api/api";
import { MatchesSummary, Player } from "../../api/model";
import { RenderItem } from "../lib/RenderItem";
import { Score } from "../lib/Score";
import { Skeleton } from "../lib/Skeleton";
import { Card } from "../ui/Card";

type Props = {
    className?: string;
} & (
    | {
          playerUid: Player["uid"];
          summary?: never;
      }
    | {
          playerUid?: never;
          summary: MatchesSummary;
      }
);

export const MatchesSummaryCard = ({ playerUid, summary: _summary, className }: Props) => {
    const { data } = useGetPlayerMatchesSummary(playerUid!, { query: { enabled: !!playerUid } });
    const summary = _summary ?? data;

    if (!summary) {
        return <Skeleton.Card />;
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
