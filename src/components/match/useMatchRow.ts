import { useGetPlayer } from "../../api/api";
import { Match } from "../../api/model";

export const useMatchRow = (match: Match, playerUid: string | undefined) => {
    const isReversed = playerUid === match.playerUids[0];
    const playerUids = isReversed ? match.playerUids.toReversed() : match.playerUids;
    const sets = isReversed ? match.sets?.toReversed() : match.sets;

    const { data: playerA } = useGetPlayer(playerUids[0]);
    const { data: playerB } = useGetPlayer(playerUids[1]);

    const isWinForA = sets ? sets[0] > sets[1] : undefined;
    const isWinForB = sets ? sets[1] > sets[0] : undefined;

    return {
        playerUids,
        sets,
        playerA,
        playerB,
        isWinForA,
        isWinForB,
    };
};
