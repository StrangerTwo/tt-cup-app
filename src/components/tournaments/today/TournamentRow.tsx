import { useNavigate } from "@tanstack/react-router";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { useGetPlayer, useGetRivalrySummary } from "../../../api/api";
import { Match, Tournament } from "../../../api/model";
import { renderHoursShort } from "../../../lib/date";
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
    tournamentId: Tournament["_id"];
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
        { label: "Sety", key: "sets", className: "text-center" },
        { label: "Last", className: "text-center" },
        { label: "Utk", className: "text-center" },
        { label: "AI" },
    ],
    FC: ({ match, tournamentId, i }) => {
        const navigate = useNavigate();
        const { textHighlightColor } = useColorLayer();
        const { data: playerA } = useGetPlayer(match.playerUids[0]);
        const { data: playerB } = useGetPlayer(match.playerUids[1]);
        const { data: summary } = useGetRivalrySummary(match.playerUids[0], match.playerUids[1]);

        return (
            <>
                <TableCell>
                    <BetOnMatchButton matchId={match._id} layerStep={2} />
                </TableCell>
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
