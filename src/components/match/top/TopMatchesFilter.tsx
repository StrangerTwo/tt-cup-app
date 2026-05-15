import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { EQueryKey } from "../../../api/EQueryKey";
import { MatchFilterType } from "../../../api/model";
import { RefreshIcon } from "../../icons";
import { Accordion } from "../../ui/Accordion";
import { MatchFilter } from "../filters/MatchFilter";
import { topMatchesFilterSchema, TopMatchesFilterType } from "./topMatchesFilterSchema";

interface Props {
    filters: TopMatchesFilterType;
    setFilters: (filter: TopMatchesFilterType) => void;
    isFetching: boolean;
}

export const TopMatchesFilter = ({ filters, setFilters, isFetching }: Props) => {
    const client = useQueryClient();

    const form = useForm({
        defaultValues: filters,
        resolver: yupResolver(topMatchesFilterSchema),
    });
    const { control, handleSubmit } = form;

    const onSubmit = (filter: TopMatchesFilterType) => {
        setFilters(filter);
    };

    const values = useWatch({ name: ["filters.*.enabled"], control });
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        console.info("xd");
        handleSubmit(onSubmit)();
    }, [...values]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Accordion
                title={
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            type="submit"
                            onClick={() => client.invalidateQueries({ queryKey: [EQueryKey.getTopMatches] })}
                            className="rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <RefreshIcon className={twMerge(isFetching && "animate-spin")} />
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                }
                isOpen>
                <div className="flex flex-col gap-2 md:gap-4">
                    {Object.values(MatchFilterType).map((type) => (
                        <MatchFilter type={type} />
                    ))}
                </div>
            </Accordion>
        </form>
    );
};
