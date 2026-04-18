import { ReactNode } from "react";

import { ScoreItem } from "./ScoreItem";

interface Props {
    scoreA: ReactNode;
    scoreB: ReactNode;
    isWinForA?: boolean;
    isWinForB?: boolean;
}

export const Score = ({ scoreA, scoreB, isWinForA, isWinForB }: Props) => {
    return (
        <>
            <ScoreItem win={isWinForA} lose={isWinForB}>
                {scoreA}
            </ScoreItem>
            <span className="mx-2">:</span>
            <ScoreItem win={isWinForB} lose={isWinForA}>
                {scoreB}
            </ScoreItem>
        </>
    );
};
