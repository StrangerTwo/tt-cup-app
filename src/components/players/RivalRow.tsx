import { FC } from "react";

import { useGetPlayer } from "../../api/api";
import { RivalMatchesSummary } from "../../api/model";
import { ScoreItem } from "../lib/ScoreItem";
import { TableProps } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { useColorLayer } from "../ui/layout";
import { PlayerLocation } from "./PlayerLocation";

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
        { label: "Bilance" },
        { label: "Výher" },
        { label: "Proher" },
    ],
    FC: ({ rivalMS: { matchesSummary, rival: _rival, rivalUid }, playerUid, i }) => {
        const { textHighlightColor } = useColorLayer();
        const { data: rival } = useGetPlayer(rivalUid);
        const { currentLoseStreak, currentWinStreak, matchesWon, matchesLost } = matchesSummary;

        return (
            <>
                <TableCell>
                    <span className="me-1 align-middle">{i + 1}.</span>
                    {rival?.location && <PlayerLocation location={rival.location} />}
                </TableCell>
                <TableCell className={textHighlightColor}>{rival?.name ?? rivalUid}</TableCell>
                <TableCell>{rival?.ranking}</TableCell>
                <TableCell>{rival?.elo ?? "-"}</TableCell>
                <TableCell className={textHighlightColor}>
                    <ScoreItem win={currentWinStreak > 0} lose={currentLoseStreak > 0}>
                        {currentWinStreak > 0 ? currentWinStreak : -currentLoseStreak}
                    </ScoreItem>
                </TableCell>
                <TableCell className={textHighlightColor}>
                    <ScoreItem win>{matchesWon}</ScoreItem>
                </TableCell>
                <TableCell className={textHighlightColor}>
                    <ScoreItem lose>{matchesLost}</ScoreItem>
                </TableCell>
            </>
        );
    },
};
