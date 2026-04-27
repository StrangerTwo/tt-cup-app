import { useGetPlayer } from "../../api/api";
import { Match } from "../../api/model";

export const useMatchRow = (match: Match, playerUid: string | undefined) => {
    const isReversed = playerUid === match.playerUids[1];
    const playerUids = isReversed ? match.playerUids.toReversed() : match.playerUids;
    const sets = isReversed ? match.sets?.toReversed() : match.sets;

    const { data: playerA } = useGetPlayer(playerUids[0]);
    const { data: playerB } = useGetPlayer(playerUids[1]);

    const isWinForA = sets?.[0] == 3;
    const isWinForB = sets?.[1] == 3;

    return {
        playerUids,
        sets,
        playerA,
        playerB,
        isWinForA,
        isWinForB,
    };
};
