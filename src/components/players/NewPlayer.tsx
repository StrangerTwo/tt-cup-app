import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import { getGetPlayersQueryKey, useNewPlayer } from "../../api/api";
import { resolveErrorMessage } from "../../lib/toastError";
import { Input } from "../form/Input";
import { SubmitButton } from "../lib/SubmitButton";
import { Card } from "../ui/Card";
import { newPlayerFormSchema, NewPlayerFormType } from "./newPlayerSchema";

export const NewPlayer = () => {
    const navigate = useNavigate();

    const client = useQueryClient();
    const { mutateAsync } = useNewPlayer();
    const form = useForm({
        resolver: yupResolver(newPlayerFormSchema),
    });
    const { handleSubmit, setValue, control } = form;

    const uidValue = useWatch({ control, name: "uid" });

    useEffect(() => {
        if (uidValue?.includes("/")) {
            var newUid = uidValue.at(-1) === "/" ? uidValue.slice(0, -1) : uidValue,
                newUid = newUid.slice(newUid.lastIndexOf("/") + 1);
            setValue("uid", newUid);
        }
    }, [setValue, uidValue]);

    const onSubmit = (data: NewPlayerFormType) => {
        toast.promise(
            mutateAsync({ data }).then(() => {
                client.invalidateQueries({ queryKey: getGetPlayersQueryKey() });
                navigate({ to: "/players" });
            }),
            {
                loading: "Ukládám...",
                success: "Uloženo",
                error: resolveErrorMessage,
            },
        );
    };

    return (
        <Card>
            <h2 className="mb-4">Nový hráč</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input form={form} label="UID hráče" name="uid" />
                <SubmitButton>Uložit</SubmitButton>
            </form>
        </Card>
    );
};
