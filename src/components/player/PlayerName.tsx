import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

import { Player } from "../../api/model";
import { renderNameShort } from "../../lib/name";

interface Props {
    player?: Player;
    uid?: string;
    firstLetter?: boolean;
}

export const PlayerName = ({ player, uid, firstLetter }: Props) => {
    if (player?.name) return renderNameShort(player.name, firstLetter);

    if (player) return player.uid;

    return (
        <Link to="/player/new" onClick={(e) => e.stopPropagation()} search={{ uid }}>
            <u className={twMerge("decoration-dotted")}>{uid}</u>
        </Link>
    );
};
