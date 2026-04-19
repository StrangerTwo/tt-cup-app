import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import { getGetPlayerQueryKey, useEditPlayer } from "../../api/api";
import { Location, Player } from "../../api/model";
import { resolveErrorMessage } from "../../lib/toastError";
import { BoxSelect } from "../form/BoxSelect";
import { Input } from "../form/Input";
import { SubmitButton } from "../lib/SubmitButton";
import { EditPlayerFormType, editPlayerSchema } from "./editPlayerSchema";

interface Props {
    player: Player;
    className?: string;
    onSubmit: () => unknown;
}

export const EditPlayerForm = ({ player, className, onSubmit: _onSubmit }: Props) => {
    const client = useQueryClient();
    const { mutateAsync } = useEditPlayer();
    const form = useForm({
        resolver: yupResolver(editPlayerSchema),
        defaultValues: {
            location: player.location,
            note: player.note,
            stisId: player.stisId,
        },
    });
    const { handleSubmit, control, setValue } = form;

    const stisId = useWatch({ control, name: "stisId" });

    useEffect(() => {
        if (stisId?.includes("stis.ping-pong.cz/")) {
            var newId = stisId.slice(stisId.indexOf("stis.ping-pong.cz/hrac-") + "stis.ping-pong.cz/hrac-".length);
            newId = newId.slice(0, newId.indexOf("/"));

            setValue("stisId", newId);
        }
    }, [setValue, stisId]);

    const onSubmit = (data: EditPlayerFormType) => {
        toast.promise(
            mutateAsync({
                playerUid: player.uid,
                data,
            }).then(() => {
                client.setQueryData(
                    getGetPlayerQueryKey(player.uid),
                    (p: Player | undefined): Player => ({ ...p, uid: player.uid, ...data }),
                );
                _onSubmit();
            }),
            {
                loading: "Ukládám...",
                success: "Uloženo",
                error: resolveErrorMessage,
            },
        );
    };
    return (
        <form className={twMerge("flex flex-col gap-2 md:gap-4", className)} onSubmit={handleSubmit(onSubmit)}>
            <BoxSelect
                form={form}
                label="Lokace"
                name="location"
                options={Object.entries(Location).map(([label, value]) => ({ label, value }))}
            />

            <Input form={form} name="stisId" label="Stis ID" />

            <Input form={form} name="note" label="Poznámka" />

            <SubmitButton>Uložit</SubmitButton>
        </form>
    );
};
