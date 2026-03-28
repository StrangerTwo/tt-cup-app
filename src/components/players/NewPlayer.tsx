import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getGetPlayersQueryKey, useNewPlayer } from "../../api/api";
import { resolveErrorMessage } from "../../lib/toastError";
import { Input } from "../form/Input";
import { SubmitButton } from "../lib/SubmitButton";
import { Card } from "../ui/Card";
import { newPlayerFormSchema, NewPlayerFormType } from "./newPlayerSchema";

export const NewPlayer = () => {
    const client = useQueryClient();
    const { mutateAsync } = useNewPlayer();
    const form = useForm({
        resolver: yupResolver(newPlayerFormSchema),
    });
    const { handleSubmit } = form;

    const onSubmit = (data: NewPlayerFormType) => {
        toast.promise(
            mutateAsync({ data }).then(() => {
                client.invalidateQueries({ queryKey: getGetPlayersQueryKey() });
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
