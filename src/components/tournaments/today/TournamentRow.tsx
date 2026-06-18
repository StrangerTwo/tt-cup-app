import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { useGetPlayer, useGetSummaryForRivalry } from "../../../api/api";
import { Match } from "../../../api/model";
import { renderDateShortWithHoursShort } from "../../../lib/date";
import { renderNameShort } from "../../../lib/name";
import { BetOnMatchButton } from "../../bet/BetOnMatchButton";
import { Score } from "../../lib/Score";
import { ScoreItem } from "../../lib/ScoreItem";
import { Skeleton } from "../../lib/Skeleton";
import { TableProps } from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { useColorLayer } from "../../ui/layout";

interface TournamentRowProps {
    match: Match;
}

export const TournamentRow: {
    Heading: TableProps<Match>["heading"];
    FC: FC<TournamentRowProps>;
} = {
    Heading: [
        { label: "Bet" },
        { label: "Čas", key: "time", className: "text-center" },
        { label: "Hráč - Hráč", key: "playerUids", className: "text-center" },
        { label: "Sety", key: "sets", className: "text-center" },
        { label: "Last", className: "text-center" },
        { label: "Utk", className: "text-center" },
        { label: "AI" },
    ],
    FC: ({ match }) => {
        const { textHighlightColor } = useColorLayer();
        const { data: playerA } = useGetPlayer(match.playerUids[0]);
        const { data: playerB } = useGetPlayer(match.playerUids[1]);
        const { data: summary } = useGetSummaryForRivalry(match.playerUids[0], match.playerUids[1]);

        return (
            <>
                <TableCell>
                    <BetOnMatchButton matchId={match._id} />
                </TableCell>
                <TableCell className="text-center">
                    <Link to="/tournament/$tournamentId" params={{ tournamentId: match.tournamentId }}>
                        {renderDateShortWithHoursShort(match.time)}
                    </Link>
                </TableCell>
                <TableCell className={twMerge("text-center font-medium", textHighlightColor)}>
                    <Link
                        to="/player/$playerUid/vs/$rivalUid"
                        params={{ playerUid: match.playerUids[0], rivalUid: match.playerUids[1] }}>
                        {renderNameShort(playerA?.name) ?? match.playerUids[0]} -{" "}
                        {renderNameShort(playerB?.name) ?? match.playerUids[1]}
                    </Link>
                </TableCell>
                <TableCell className="text-center">
                    <Score
                        scoreA={match.sets?.[0]}
                        scoreB={match.sets?.[1]}
                        isWinForA={match.sets?.[0] == 3}
                        isWinForB={match.sets?.[1] == 3}
                    />
                </TableCell>
                <TableCell className="text-center">
                    {summary ? (
                        <ScoreItem win={summary.currentWinStreak > 0} lose={summary.currentLoseStreak > 0}>
                            {summary.currentWinStreak > 0 ? summary.currentWinStreak : -summary.currentLoseStreak}
                        </ScoreItem>
                    ) : (
                        <Skeleton.Text className="mb-0" />
                    )}
                </TableCell>
                <TableCell className="text-center">
                    {summary ? (
                        <Score scoreA={summary.matchesWon} scoreB={summary.matchesLost} />
                    ) : (
                        <Skeleton.Text className="mb-0" />
                    )}
                </TableCell>
                <TableCell>X</TableCell>
            </>
        );
    },
};
