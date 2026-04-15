import { twMerge } from "tailwind-merge";

import { useGetPlayer } from "../../api/api";
import { Match } from "../../api/model";
import { renderFullDateWithHoursShort } from "../../lib/date";
import { TableProps } from "../lib/Table";
import { useColorLayer } from "../ui/layout";

export const MatchRow: {
    Heading: TableProps<Match>["heading"];
    RowFc: Required<TableProps<Match>>["RowFc"];
} = {
    Heading: [
        { label: "Čas", key: "time" },
        { label: "A" },
        { label: "Sety", key: "sets" },
        { label: "B" },
        { label: "Body", key: "points" },
    ],
    RowFc: ({ item: match, i }) => {
        const { data: playerA } = useGetPlayer(match.playerUids[0]);
        const { data: playerB } = useGetPlayer(match.playerUids[1]);
        const { textHighlightColor } = useColorLayer();

        const isWinForA = match.sets ? match.sets[0] > match.sets[1] : undefined;
        const isWinForB = match.sets ? match.sets[1] > match.sets[0] : undefined;

        return (
            <>
                <td className={twMerge("whitespace-nowrap px-6 py-4", textHighlightColor)}>
                    {renderFullDateWithHoursShort(match.time)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{playerA?.name ?? match.playerUids[0]}</td>
                <td className={twMerge("whitespace-nowrap px-6 py-4", textHighlightColor)}>
                    <div
                        className={twMerge(
                            "inline-flex aspect-square min-w-[1em] items-center justify-center",
                            isWinForA && "bg-green-500 text-white dark:bg-green-800",
                            isWinForB && "bg-red-500 text-white dark:bg-red-800",
                        )}>
                        {match.sets?.[0]}
                    </div>
                    <span className="mx-2">:</span>
                    <div
                        className={twMerge(
                            "inline-flex aspect-square min-w-[1em] items-center justify-center",
                            isWinForB && "bg-green-500 text-white dark:bg-green-800",
                            isWinForA && "bg-red-500 text-white dark:bg-red-800",
                        )}>
                        {match.sets?.[1]}
                    </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{playerB?.name ?? match.playerUids[1]}</td>
                <td className="whitespace-nowrap px-6 py-4">{match.points?.join("; ")}</td>
            </>
        );
    },
};
