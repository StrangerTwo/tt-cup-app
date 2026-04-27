import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getGetBetQueryKey, getGetPlayerQueryKey, getGetTournamentQueryOptions, getTournament } from "../../api/api";
import { Bet, Player } from "../../api/model";

export const useTournament = (tournamentId: string | undefined) => {
    const client = useQueryClient();

    return useQuery({
        ...getGetTournamentQueryOptions(tournamentId!),

        enabled: !!tournamentId,

        queryFn: () =>
            getTournament(tournamentId!, { players: true }).then((res) => {
                res.matches.forEach((match) => {
                    client.setQueryData(
                        getGetBetQueryKey(match._id),
                        (b: Bet | null | undefined): Bet | null =>
                            res.bets.find((x) => x.matchId === match._id) ?? null,
                    );
                });
                res.players?.forEach((player) => {
                    client.setQueryData(
                        getGetPlayerQueryKey(player.uid),
                        (p: Player | null | undefined): Player => player,
                    );
                });
                return res;
            }),
    });
};
