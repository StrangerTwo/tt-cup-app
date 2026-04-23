import { useNavigate } from "@tanstack/react-router";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { useGetPlayer, useGetPlayerRival } from "../../api/api";
import { Match } from "../../api/model";
import { renderHoursShort } from "../../lib/date";
import { renderNameShort } from "../../lib/name";
import { Score } from "../lib/Score";
import { ScoreItem } from "../lib/ScoreItem";
import { Skeleton } from "../lib/Skeleton";
import { TableProps } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { useColorLayer } from "../ui/layout";

interface TournamentRowProps {
    match: Match;
    i: number;
}

export const TournamentRow: {
    Heading: TableProps<Match>["heading"];
    FC: FC<TournamentRowProps>;
} = {
    Heading: [
        { label: "Bet" },
        { label: "Čas", key: "time", className: "text-center" },
        { label: "Hráč - Hráč", key: "playerUids", className: "text-center" },
        { label: "Výsledek", key: "sets", className: "text-center" },
        { label: "Bil", className: "text-center" },
        { label: "Utk", className: "text-center" },
        { label: "AI" },
    ],
    FC: ({ match, i }) => {
        const navigate = useNavigate();
        const { textHighlightColor } = useColorLayer();
        const { data: playerA } = useGetPlayer(match.playerUids[0]);
        const { data: playerB } = useGetPlayer(match.playerUids[1]);
        const { data: summary } = useGetPlayerRival(match.playerUids[0], match.playerUids[1]);

        return (
            <>
                <TableCell>X</TableCell>
                <TableCell className="text-center">{renderHoursShort(match.time)}</TableCell>
                <TableCell
                    className={twMerge("cursor-pointer text-center font-medium", textHighlightColor)}
                    onClick={() =>
                        navigate({
                            to: "/player/$playerUid/vs/$rivalUid",
                            params: { playerUid: match.playerUids[0], rivalUid: match.playerUids[1] },
                        })
                    }>
                    {renderNameShort(playerA?.name) ?? match.playerUids[0]} -{" "}
                    {renderNameShort(playerB?.name) ?? match.playerUids[1]}
                </TableCell>
                <TableCell className="text-center">
                    <Score
                        scoreA={match.sets?.[0]}
                        scoreB={match.sets?.[1]}
                        isWinForA={match.sets && match.sets?.[0] > match.sets?.[1]}
                        isWinForB={match.sets && match.sets?.[0] < match.sets?.[1]}
                    />
                </TableCell>
                <TableCell className="text-center">
                    {summary ? (
                        <ScoreItem
                            win={summary.matchesSummary.currentWinStreak > 0}
                            lose={summary.matchesSummary.currentLoseStreak > 0}>
                            {summary.matchesSummary.currentWinStreak > 0
                                ? summary.matchesSummary.currentWinStreak
                                : -summary.matchesSummary.currentLoseStreak}
                        </ScoreItem>
                    ) : (
                        <Skeleton.Text className="mb-0" />
                    )}
                </TableCell>
                <TableCell className="text-center">
                    {summary ? (
                        <Score scoreA={summary.matchesSummary.matchesWon} scoreB={summary.matchesSummary.matchesLost} />
                    ) : (
                        <Skeleton.Text className="mb-0" />
                    )}
                </TableCell>
                <TableCell>X</TableCell>
            </>
        );
    },
};
