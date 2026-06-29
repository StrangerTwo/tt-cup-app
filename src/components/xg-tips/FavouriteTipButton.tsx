import { useQueryClient } from "@tanstack/react-query";
import { FC, useMemo } from "react";
import toast from "react-hot-toast";

import { getGetFavouriteTipsQueryKey, useFavouriteTip, useGetFavouriteTips } from "../../api/api";
import { FavouriteTip, XgTip } from "../../api/model";
import { auth } from "../../firebase/firebase";
import { resolveErrorMessage } from "../../lib/toastError";
import { useAuth } from "../../lib/useAuth";
import { StarIcon } from "../icons";
import { IconButton } from "../ui/IconButton";

interface Props {
    tip: XgTip;
}

export const FavouriteTipButton: FC<Props> = ({ tip }) => {
    const { data } = useGetFavouriteTips({ query: { enabled: !!useAuth(auth) } });
    const isFavourite = useMemo(() => {
        return !!data?.find((f) => tip.id === f.tipId);
    }, [data, tip.id]);

    const { mutateAsync } = useFavouriteTip();
    const client = useQueryClient();

    const favouriteTip = () => {
        toast.promise(
            mutateAsync({
                tipId: tip.id,
                data: {
                    favourite: !isFavourite,
                },
            }).then((res) => {
                client.setQueryData(
                    getGetFavouriteTipsQueryKey(),
                    (x?: Array<FavouriteTip>): Array<FavouriteTip> =>
                        isFavourite
                            ? (x || []).filter((f) => f.tipId !== tip.id)
                            : [...(x || []), { tipId: tip.id, userId: "", timestamp: "" }],
                );
            }),
            {
                loading: isFavourite ? "Odebírám" : "Přidávám..",
                success: isFavourite ? "Odebráno" : "Přidáno",
                error: resolveErrorMessage,
            },
        );
    };

    return (
        <IconButton
            className="group"
            onClick={(e) => {
                e.stopPropagation();
                favouriteTip();
            }}>
            <StarIcon fill={isFavourite} />
        </IconButton>
    );
};
