import { FC } from "react";

import { TopMatch } from "../../../api/model";
import { TableProps } from "../../lib/Table";
import { TournamentRow } from "../../tournaments/today/TournamentRow";

interface TopMatchRowProps {
    topMatch: TopMatch;
}

export const TopMatchRow: {
    Heading: TableProps<TopMatch>["heading"];
    FC: FC<TopMatchRowProps>;
} = {
    Heading: [
        { label: "Bet" },
        { label: "Čas", key: "match.time", className: "text-center" },
        { label: "Hráč - Hráč", key: "match.playerUids", className: "text-center" },
        { label: "Sety", key: "match.sets", className: "text-center" },
        { label: "Last", className: "text-center" },
        { label: "Utk", className: "text-center" },
        { label: "AI" },
    ],
    FC: ({ topMatch }) => {
        return <TournamentRow.FC match={topMatch.match} />;
    },
};
