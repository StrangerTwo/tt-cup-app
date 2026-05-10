import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { useGetPlayer } from "../../../api/api";
import { RivalMatchesSummary } from "../../../api/model";
import { Score } from "../../lib/Score";
import { ScoreItem } from "../../lib/ScoreItem";
import { TableProps } from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { useColorLayer } from "../../ui/layout";
import { PlayerLocation } from "../PlayerLocation";
import { PlayerName } from "../PlayerName";

interface RivalRowProps {
    rivalMS: RivalMatchesSummary;
    playerUid?: string;
    i: number;
}

export const RivalRow: {
    Heading: TableProps<RivalMatchesSummary>["heading"];
    FC: FC<RivalRowProps>;
} = {
    Heading: [
        { label: "#" },
        { label: "Soupeř", key: "rival.name" as any },
        { label: "Rank", key: "rival.ranking" },
        { label: "Elo", key: "rival.elo" },
        { label: "Last", className: "text-center" },
        { label: "Utk", className: "text-center" },
    ],
    FC: ({ rivalMS: { matchesSummary, rival: _rival, rivalUid }, playerUid, i }) => {
        const { textHighlightColor } = useColorLayer();
        const { data: rival } = useGetPlayer(rivalUid);
        const { currentLoseStreak, currentWinStreak, matchesWon, matchesLost } = matchesSummary;

        return (
            <>
                <TableCell>{rival?.location && <PlayerLocation location={rival.location} />}</TableCell>
                <TableCell
                    className={twMerge(textHighlightColor, "max-w-24 overflow-hidden text-ellipsis md:max-w-none")}>
                    <PlayerName player={rival} uid={rivalUid} />
                </TableCell>
                <TableCell>{rival?.ranking}</TableCell>
                <TableCell>{rival?.elo ?? "-"}</TableCell>
                <TableCell className={twMerge(textHighlightColor, "text-center")}>
                    <ScoreItem win={currentWinStreak > 0} lose={currentLoseStreak > 0}>
                        {currentWinStreak > 0 ? currentWinStreak : -currentLoseStreak}
                    </ScoreItem>
                </TableCell>
                <TableCell className={twMerge(textHighlightColor, "text-center")}>
                    <Score scoreA={matchesWon} scoreB={matchesLost} isWinForA />
                </TableCell>
            </>
        );
    },
};
