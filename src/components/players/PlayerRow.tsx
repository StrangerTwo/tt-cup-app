import { FC } from "react";

import { useGetPlayer } from "../../api/api";
import { Player } from "../../api/model";
import { Skeleton } from "../lib/Skeleton";
import { TableProps } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { Card } from "../ui/Card";
import { FavouritePlayerButton } from "./FavouritePlayerButton";

interface PlayerRowProps {
    playerUid: Player["uid"];
    i: number;
}

export const PlayerRow: {
    Heading: TableProps<Player>["heading"];
    FC: FC<PlayerRowProps>;
} = {
    Heading: [
        { label: "#" },
        { label: "Jméno hráče", key: "name" },
        { label: "Ranking", key: "ranking" },
        { label: "Elo", key: "elo" },
        { label: "Oblíbené", key: "favourite" },
        { label: "uid", key: "uid" },
    ],
    FC: ({ playerUid, i }) => {
        const { data: player } = useGetPlayer(playerUid);

        if (!player)
            return (
                <TableCell colSpan={PlayerRow.Heading?.length || 42}>
                    <Skeleton.Text className="m-4" />
                </TableCell>
            );

        return (
            <>
                <TableCell>{i + 1}.</TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">{player.name}</TableCell>
                <TableCell>
                    <span className="me-1 align-middle">{player.ranking}</span>
                    <Card className="inline-flex size-[1.5em] items-center justify-center p-0 align-middle md:p-0">
                        {player.location ?? ""}
                    </Card>
                </TableCell>
                <TableCell>{player.elo ?? "-"}</TableCell>
                <TableCell>
                    <FavouritePlayerButton playerUid={player.uid} className={"size-5 align-middle"} />
                </TableCell>
                <TableCell>{player.uid}</TableCell>
            </>
        );
    },
};
