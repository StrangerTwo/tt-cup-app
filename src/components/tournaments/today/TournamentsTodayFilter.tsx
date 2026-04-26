import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { EQueryKey } from "../../../api/EQueryKey";
import { Location } from "../../../api/model";
import { BoxSelect } from "../../form/BoxSelect";
import { Toggle } from "../../form/Toggle";
import { RefreshIcon } from "../../icons";
import { locationLabels } from "../../player/PlayerLocation";
import { tournamentsTodayFilterSchema, TournamentsTodayFilterType } from "./tournamentsTodayFilterSchema";

interface Props {
    filters: TournamentsTodayFilterType;
    setFilters: (filter: TournamentsTodayFilterType) => void;
    isFetching: boolean;
}

export const TournamentsTodayFilter = ({ filters, setFilters, isFetching }: Props) => {
    const client = useQueryClient();

    const form = useForm({
        defaultValues: {
            location: filters.location,
            done: filters.done,
        },
        resolver: yupResolver(tournamentsTodayFilterSchema),
    });
    const { control, handleSubmit } = form;

    const onSubmit = (filter: TournamentsTodayFilterType) => {
        setFilters(filter);
    };

    const [location, done] = useWatch({ name: ["location", "done"], control });
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleSubmit(onSubmit)();
    }, [location, done]);

    return (
        <form className="flex max-w-xs flex-col items-start md:max-w-md" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    type="submit"
                    onClick={() => client.invalidateQueries({ queryKey: [EQueryKey.getTournamentsToday] })}
                    className="rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <RefreshIcon className={twMerge(isFetching && "animate-spin")} />
                    <span className="sr-only">Search</span>
                </button>
                <Toggle form={form} name="done" label="Dokončené" />
            </div>
            <BoxSelect
                form={form}
                name="location"
                className="col-span-full mt-2"
                options={Object.values(Location).map((value) => ({ label: locationLabels[value], value }))}
            />
        </form>
    );
};
