import { FC } from "react";

import { Player } from "../../api/model";
import { TableProps } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { Card } from "../ui/Card";
import { FavouritePlayerButton } from "./FavouritePlayerButton";

interface PlayerRowProps {
    player: Player;
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
    FC: ({ player, i }) => {
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
