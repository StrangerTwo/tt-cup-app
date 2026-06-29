import { useQueryClient } from "@tanstack/react-query";
import { FC, useMemo } from "react";
import toast from "react-hot-toast";

import { getGetFavouriteTipsQueryKey, useFavouriteTip, useGetFavouriteTips } from "../../api/api";
import { FavouriteTip, XgTip } from "../../api/model";
import { resolveErrorMessage } from "../../lib/toastError";
import { DropdownContainer } from "../form/DropdownContainer";
import { IconButton } from "../ui/IconButton";

interface Props {
    tip: XgTip;
    ticketCount: number;
}

export const AddTipToTicket: FC<Props> = ({ tip, ticketCount }) => {
    const { data: favourites } = useGetFavouriteTips();
    const { mutateAsync } = useFavouriteTip();
    const client = useQueryClient();

    const favourite = useMemo(() => {
        const f = favourites?.find((f) => f.tipId === tip.id);
        if (!f) throw new Error("wat");
        return f;
    }, [favourites, tip.id]);

    const onChange = (i: number) => {
        const tickets = favourite.tickets ?? [];
        if (tickets.includes(i)) {
            toast.promise(
                mutateAsync({
                    tipId: tip.id,
                    data: {
                        favourite: true,
                        tickets: tickets.filter((x) => x !== i),
                    },
                }).then((res) => {
                    client.setQueryData(
                        getGetFavouriteTipsQueryKey(),
                        (x: Array<FavouriteTip>): Array<FavouriteTip> =>
                            x.map((f) => ({
                                ...f,
                                tickets: f.tipId === tip.id ? (f.tickets ?? []).filter((x) => x !== i) : f.tickets,
                            })),
                    );
                }),
                {
                    loading: "Odebírám..",
                    success: "Odebráno",
                    error: resolveErrorMessage,
                },
            );
        } else {
            toast.promise(
                mutateAsync({
                    tipId: tip.id,
                    data: {
                        favourite: true,
                        tickets: [...tickets, i],
                    },
                }).then((res) => {
                    client.setQueryData(
                        getGetFavouriteTipsQueryKey(),
                        (x: Array<FavouriteTip>): Array<FavouriteTip> =>
                            x.map((f) => ({
                                ...f,
                                tickets: f.tipId === tip.id ? [...(f.tickets ?? []), i] : f.tickets,
                            })),
                    );
                }),
                {
                    loading: "Přidávám..",
                    success: "Přidáno",
                    error: resolveErrorMessage,
                },
            );
        }
    };

    return (
        <DropdownContainer
            optionListClassname="whitespace-nowrap"
            options={Array.from({ length: ticketCount }, (v, i) => i).map((i) => ({
                label: `${i + 1} ${favourite.tickets?.includes(i) ? "✔️" : "❌"}`,
                value: i,
            }))}
            onChange={onChange}>
            {({ setOpen, icon }) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen((x) => !x);
                    }}>
                    {icon}
                </IconButton>
            )}
        </DropdownContainer>
    );
};
