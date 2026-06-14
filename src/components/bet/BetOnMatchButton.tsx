import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import { getGetBetQueryKey, useGetBet, useSetBet } from "../../api/api";
import { Bet, BetType, Match } from "../../api/model";
import { resolveErrorMessage } from "../../lib/toastError";
import { Skeleton } from "../lib/Skeleton";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";

interface Props {
    matchId: Match["_id"];
    className?: string;
}

const betNode = (type: BetType): ReactNode => {
    switch (type) {
        case "N":
            return "/";
        case "W1":
            return "1";
        case "W2":
            return "2";
    }
};

const betTypes = [BetType.NO_BET, BetType.WIN_1, BetType.WIN_2];

export const BetOnMatchButton = ({ matchId, className }: Props) => {
    const client = useQueryClient();
    const { data: bet, isFetching } = useGetBet(matchId);
    const { mutateAsync } = useSetBet();

    if (isFetching) return <Skeleton.Text />;
    const type = bet?.type ?? BetType.NO_BET;

    const toggleBet = () => {
        const newType = betTypes[(betTypes.indexOf(type) + 1) % betTypes.length];
        toast.promise(
            mutateAsync({ matchId, data: { type: newType } }).then((b) => {
                client.setQueryData(getGetBetQueryKey(matchId), (): Bet => b);
            }),
            {
                loading: "Ukládám...",
                success: "Uloženo",
                error: resolveErrorMessage,
            },
        );
    };

    return (
        <Card
            className={twMerge(
                "inline-flex p-0 md:p-0",
                bet?.win === true && "bg-green-500 text-white dark:bg-green-800",
                bet?.win === false && "bg-red-500 text-white dark:bg-red-800",
            )}>
            <IconButton
                className={twMerge("group size-6", className)}
                layerStep={1}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleBet();
                }}>
                {betNode(type)}
            </IconButton>
        </Card>
    );
};
