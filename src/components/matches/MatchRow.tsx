import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { Match } from "../../api/model";
import { renderFullDateShortWithHoursShort } from "../../lib/date";
import { TableProps } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { useColorLayer } from "../ui/layout";
import { useMatchRow } from "./useMatchRow";

interface MatchRowProps {
    match: Match;
    playerUid?: string;
}

export const MatchRow: {
    Heading: TableProps<Match>["heading"];
    FC: FC<MatchRowProps>;
} = {
    Heading: [
        { label: "Čas", key: "time" },
        { label: "Sety", key: "sets" },
        { label: "A" },
        { label: "B" },
        { label: "Body", key: "points" },
    ],
    FC: ({ match, playerUid }) => {
        const { playerA, playerB, isWinForA, isWinForB, playerUids, sets } = useMatchRow(match, playerUid);
        const { textHighlightColor } = useColorLayer();

        return (
            <>
                <TableCell className={textHighlightColor}>{renderFullDateShortWithHoursShort(match.time)}</TableCell>
                <TableCell className={textHighlightColor}>
                    <div
                        className={twMerge(
                            "inline-flex aspect-square min-w-[1em] items-center justify-center",
                            isWinForA && "bg-green-500 text-white dark:bg-green-800",
                            isWinForB && "bg-red-500 text-white dark:bg-red-800",
                        )}>
                        {sets?.[0]}
                    </div>
                    <span className="mx-2">:</span>
                    <div
                        className={twMerge(
                            "inline-flex aspect-square min-w-[1em] items-center justify-center",
                            isWinForB && "bg-green-500 text-white dark:bg-green-800",
                            isWinForA && "bg-red-500 text-white dark:bg-red-800",
                        )}>
                        {sets?.[1]}
                    </div>
                </TableCell>
                <TableCell>{playerA?.name ?? playerUids[0]}</TableCell>
                <TableCell>{playerB?.name ?? playerUids[1]}</TableCell>
                <TableCell>{match.points?.join("; ")}</TableCell>
            </>
        );
    },
};
