import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import { getGetPlayerQueryKey, useGetPlayer, useSetPlayerFavourite } from "../../api/api";
import { Player } from "../../api/model";
import { resolveErrorMessage } from "../../lib/toastError";
import { StarIcon } from "../icons";
import { IconButton } from "../ui/IconButton";

interface Props {
    playerUid: Player["uid"];
    className?: string;
    layerStep?: number;
}

export const FavouritePlayerButton = ({ playerUid, className, layerStep }: Props) => {
    const client = useQueryClient();
    const { data } = useGetPlayer(playerUid);
    const { mutateAsync } = useSetPlayerFavourite();

    const favouritePlayer = () => {
        const newFavourite = !data?.favourite;
        toast.promise(
            mutateAsync({ playerUid, data: { status: newFavourite } }).then(() => {
                client.setQueryData(
                    getGetPlayerQueryKey(playerUid),
                    (p: Player | undefined): Player => ({ ...p, uid: playerUid, favourite: newFavourite }),
                );
            }),
            {
                loading: "Ukládám...",
                success: "Uloženo",
                error: resolveErrorMessage,
            },
        );
    };

    return (
        <IconButton
            className={twMerge("group", className)}
            layerStep={layerStep}
            onClick={(e) => {
                e.stopPropagation();
                favouritePlayer();
            }}>
            <StarIcon fill={data?.favourite || false} />
        </IconButton>
    );
};
