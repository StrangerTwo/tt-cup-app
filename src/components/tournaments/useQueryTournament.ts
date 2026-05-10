import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
    getGetBetQueryKey,
    getGetPlaceQueryKey,
    getGetPlayerQueryKey,
    getGetQueryTournamentQueryOptions,
    getGetTournamentQueryKey,
    getQueryTournament,
} from "../../api/api";
import { Bet, GetQueryTournamentParams, Place, Player, TournamentFull } from "../../api/model";

export const useQueryTournament = (params: GetQueryTournamentParams, enabled = true) => {
    const client = useQueryClient();

    return useQuery({
        ...getGetQueryTournamentQueryOptions(params),

        enabled,

        queryFn: () =>
            getQueryTournament(params).then((res) => {
                const { place, tournament, matches, bets, players } = res;
                client.setQueryData(getGetPlaceQueryKey(place.uid), (x: Place | undefined) => place);
                client.setQueryData(
                    getGetTournamentQueryKey(tournament._id),
                    (t: TournamentFull | undefined): TournamentFull => ({
                        place,
                        tournament,
                        matches,
                        bets,
                    }),
                );
                matches.forEach((match) => {
                    client.setQueryData(
                        getGetBetQueryKey(match._id),
                        (b: Bet | null | undefined): Bet | null => bets.find((x) => x.matchId === match._id) ?? null,
                    );
                });
                players?.forEach((player) => {
                    client.setQueryData(
                        getGetPlayerQueryKey(player.uid),
                        (p: Player | null | undefined): Player => player,
                    );
                });
                return res;
            }),
    });
};
