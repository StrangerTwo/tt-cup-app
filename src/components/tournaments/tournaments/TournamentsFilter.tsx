import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { EQueryKey } from "../../../api/EQueryKey";
import { Location } from "../../../api/model";
import { BoxSelect } from "../../form/BoxSelect";
import { RefreshIcon } from "../../icons";
import { locationLabels } from "../../player/PlayerLocation";
import { tournamentsFilterSchema, TournamentsFilterType } from "./tournamentsFilterSchema";

interface Props {
    filters: TournamentsFilterType;
    setFilters: (filter: TournamentsFilterType) => void;
    isFetching: boolean;
}

export const TournamentsFilter = ({ filters, setFilters, isFetching }: Props) => {
    const client = useQueryClient();

    const form = useForm({
        defaultValues: {
            location: filters.location,
        },
        resolver: yupResolver(tournamentsFilterSchema),
    });
    const { control, handleSubmit } = form;

    const onSubmit = (filter: TournamentsFilterType) => {
        setFilters(filter);
    };

    const [location] = useWatch({ name: ["location"], control });
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleSubmit(onSubmit)();
    }, [location]);

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
