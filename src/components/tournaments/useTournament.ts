import { useQueryClient } from "@tanstack/react-query";

import { getGetBetQueryKey, useGetTournament } from "../../api/api";
import { Bet } from "../../api/model";

export const useTournament = (tournamentId: string | undefined) => {
    const client = useQueryClient();
    return useGetTournament(tournamentId!, {
        query: {
            enabled: !!tournamentId,
            select: (res) => {
                res.matches.forEach((match) => {
                    client.setQueryData(
                        getGetBetQueryKey(match._id),
                        (b: Bet | null | undefined): Bet | null =>
                            res.bets.find((x) => x.matchId === match._id) ?? null,
                    );
                });
                return res;
            },
        },
    });
};
