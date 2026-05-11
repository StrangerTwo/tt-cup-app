import { FC } from "react";

import { useGetPlayer, useGetSummaryForPlayer } from "../../../api/api";
import { Player, PlayerSummary } from "../../../api/model";
import { Score } from "../../lib/Score";
import { Skeleton } from "../../lib/Skeleton";
import { TableProps } from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { FavouritePlayerButton } from "../FavouritePlayerButton";
import { PlayerLocation } from "../PlayerLocation";

interface PlayerRowProps {
    playerUid: Player["uid"];
    i: number;
}

export const PlayerRow: {
    Heading: TableProps<PlayerSummary>["heading"];
    FC: FC<PlayerRowProps>;
} = {
    Heading: [
        { label: "#" },
        { label: "Jméno hráče", key: "player.name" },
        { label: "Rank", key: "player.ranking" },
        { label: "Elo", key: "player.elo" },
        { label: "★", key: "player.favourite" },
        { label: "Utk", key: "summary.winRate" },
        { label: "uid", key: "player.uid" },
    ],
    FC: ({ playerUid, i }) => {
        const { data: player } = useGetPlayer(playerUid);
        const { data: summary } = useGetSummaryForPlayer(playerUid);

        if (!player)
            return (
                <TableCell colSpan={PlayerRow.Heading?.length || 42}>
                    <Skeleton.Text className="m-4" />
                </TableCell>
            );

        return (
            <>
                <TableCell>
                    <PlayerLocation location={player.location} />
                    <span className="ms-1 align-middle">{i + 1}.</span>
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">{player.name}</TableCell>
                <TableCell>{player.ranking}</TableCell>
                <TableCell>{player.elo ?? "-"}</TableCell>
                <TableCell>
                    <FavouritePlayerButton playerUid={player.uid} className={"size-5 align-middle"} layerStep={1} />
                </TableCell>
                <TableCell>
                    {summary ? (
                        <Score scoreA={summary.matchesWon} scoreB={summary.matchesLost} isWinForA />
                    ) : (
                        <Skeleton.Text />
                    )}
                </TableCell>
                <TableCell>{player.uid}</TableCell>
            </>
        );
    },
};
