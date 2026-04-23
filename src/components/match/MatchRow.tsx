import { FC } from "react";

import { Match } from "../../api/model";
import { renderDateShortWithHoursShort } from "../../lib/date";
import { renderNameShort } from "../../lib/name";
import { Score } from "../lib/Score";
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
                <TableCell className={textHighlightColor}>
                    <span className="me-2 align-middle">{renderDateShortWithHoursShort(match.time)}</span>
                </TableCell>
                <TableCell className={textHighlightColor}>
                    <Score scoreA={sets?.[0]} scoreB={sets?.[1]} isWinForA={isWinForA} isWinForB={isWinForB} />
                </TableCell>
                <TableCell>{renderNameShort(playerA?.name) ?? playerUids[0]}</TableCell>
                <TableCell>{renderNameShort(playerB?.name) ?? playerUids[1]}</TableCell>
                <TableCell>{match.points?.join("; ")}</TableCell>
            </>
        );
    },
};
