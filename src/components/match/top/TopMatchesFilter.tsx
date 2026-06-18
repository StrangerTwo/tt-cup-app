import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import { getGetMatchFiltersQueryKey, setMatchFilters } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { MatchFilterType } from "../../../api/model";
import { resolveErrorMessage } from "../../../lib/toastError";
import { Toggle } from "../../form/Toggle";
import { RefreshIcon, ServerIcon } from "../../icons";
import { SubmitButton } from "../../lib/SubmitButton";
import { Accordion } from "../../ui/Accordion";
import { MatchFilterField } from "../filters/MatchFilterField";
import { toMatchFilters, topMatchesFilterSchema, TopMatchesFilterType } from "./topMatchesFilterSchema";

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
    const { handleSubmit, formState, watch } = form;
    const { dirtyFields: _dirtyFields } = formState;
    const { done, ...dirtyFields } = _dirtyFields;

    const onSubmit = useCallback(
        (filter: TopMatchesFilterType) => {
            setFilters(filter);
        },
        [setFilters],
    );

    useEffect(() => {
        const x = watch((e) => {
            handleSubmit(onSubmit)();
        });
        return () => x.unsubscribe();
    }, [handleSubmit, onSubmit, watch]);

    const saveAsDefault = (filter: TopMatchesFilterType) => {
        console.info("saved as default");
        const filters = toMatchFilters(filter);
        toast.promise(
            setMatchFilters({
                filters,
            }).then((b) => {
                client.setQueryData(getGetMatchFiltersQueryKey(), () => filters);
                form.reset(form.getValues());
            }),
            {
                loading: "Ukládám...",
                success: "Uloženo",
                error: resolveErrorMessage,
            },
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormProvider {...form}>
                <Accordion
                    isOpen
                    title={
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                type="submit"
                                onClick={() => client.invalidateQueries({ queryKey: [EQueryKey.getTopMatches] })}
                                className="rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <RefreshIcon className={twMerge(isFetching && "animate-spin")} />
                                <span className="sr-only">Search</span>
                            </button>
                            <Toggle form={form} name="done" label="Dokončené" />
                        </div>
                    }>
                    <div className="flex flex-col gap-2 md:gap-4">
                        {Object.values(MatchFilterType).map((type) => (
                            <MatchFilterField key={type} type={type} />
                        ))}
                        <SubmitButton
                            className="flex size-10 items-center justify-center p-0"
                            disabled={Object.keys(dirtyFields).length === 0}
                            type="button"
                            onClick={handleSubmit(saveAsDefault)}>
                            <ServerIcon />
                        </SubmitButton>
                    </div>
                </Accordion>
            </FormProvider>
        </form>
    );
};
