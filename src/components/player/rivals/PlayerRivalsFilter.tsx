import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { EQueryKey } from "../../../api/EQueryKey";
import { Input } from "../../form/Input";
import { RefreshIcon } from "../../icons";
import { PlayerRivalsFilterFormType, playerRivalsFilterSchema } from "./playerRivalsFilterSchema";

interface Props {
    filters: PlayerRivalsFilterFormType;
    setFilters: (filter: PlayerRivalsFilterFormType) => void;
    isFetching: boolean;
}

export const PlayerRivalsFilter = ({ filters, setFilters, isFetching }: Props) => {
    const client = useQueryClient();

    const form = useForm({
        defaultValues: {
            search: filters.search,
        },
        resolver: yupResolver(playerRivalsFilterSchema),
    });
    const { control, handleSubmit } = form;

    const onSubmit = (filter: PlayerRivalsFilterFormType) => {
        setFilters(filter);
    };

    const [search] = useWatch({ name: ["search"], control });
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleSubmit(onSubmit)();
    }, [search]);

    return (
        <form className="grid max-w-xs grid-cols-[1fr_auto] md:max-w-md" onSubmit={handleSubmit(onSubmit)}>
            <Input form={form} name="search" placeholder="Jméno" />
            <button
                type="submit"
                onClick={() => client.invalidateQueries({ queryKey: [EQueryKey.getPlayerRivals] })}
                className="ms-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <RefreshIcon className={twMerge(isFetching && "animate-spin")} />
                <span className="sr-only">Search</span>
            </button>
        </form>
    );
};
