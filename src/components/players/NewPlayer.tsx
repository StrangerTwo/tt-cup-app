import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import { useNewPlayer } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Location } from "../../api/model";
import { resolveErrorMessage } from "../../lib/toastError";
import { BoxSelect } from "../form/BoxSelect";
import { Input } from "../form/Input";
import { SubmitButton } from "../lib/SubmitButton";
import { Card } from "../ui/Card";
import { newPlayerFormSchema, NewPlayerFormType } from "./newPlayerSchema";
import { locationLabels } from "./PlayerLocation";

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
            var newUid = uidValue.at(-1) === "/" ? uidValue.slice(0, -1) : uidValue;
            newUid = newUid.slice(newUid.lastIndexOf("/") + 1);
            setValue("uid", newUid);
        }
    }, [setValue, uidValue]);

    const onSubmit = (data: NewPlayerFormType) => {
        toast.promise(
            mutateAsync({ data }).then(() => {
                client.invalidateQueries({ queryKey: [EQueryKey.getPlayers] });
                navigate({ to: "/player" });
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
                <BoxSelect
                    form={form}
                    label="Lokace"
                    name="location"
                    options={Object.values(Location).map((value) => ({ label: locationLabels[value], value }))}
                />
                <SubmitButton>Uložit</SubmitButton>
            </form>
        </Card>
    );
};
