import { FC } from "react";

import { useGetPlayer } from "../../api/api";
import { RivalMatchesSummary } from "../../api/model";
import { ScoreItem } from "../lib/ScoreItem";
import { TableProps } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { useColorLayer } from "../ui/layout";

interface RivalRowProps {
    rivalMS: RivalMatchesSummary;
    playerUid?: string;
}

export const RivalRow: {
    Heading: TableProps<RivalMatchesSummary>["heading"];
    FC: FC<RivalRowProps>;
} = {
    Heading: [
        { label: "Soupeř", key: "rivalUid" },
        { label: "Zápasů" },
        { label: "Bilance" },
        { label: "Výher", key: "matchesWon" },
        { label: "Proher", key: "matchesLost" },
    ],
    FC: ({ rivalMS, playerUid }) => {
        const {
            rivalUid,
            currentLoseStreak,
            currentWinStreak,
            longestLoseStreak,
            longestWinStreak,
            matchesLost,
            matchesWon,
        } = rivalMS;
        const { data: rival } = useGetPlayer(rivalUid);

        const { textHighlightColor } = useColorLayer();

        return (
            <>
                <TableCell className={textHighlightColor}>{rival?.name ?? rivalUid}</TableCell>
                <TableCell className={textHighlightColor}>{matchesWon + matchesLost}</TableCell>
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
