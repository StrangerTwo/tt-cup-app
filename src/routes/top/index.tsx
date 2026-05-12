import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

import { useGetTopMatches } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { RefreshIcon } from "../../components/icons";
import { Card } from "../../components/ui/Card";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";

export const Route = createFileRoute("/top/")({
    component: RouteComponent,
});

function RouteComponent() {
    const client = useQueryClient();
    const { mutateAsync } = useGetTopMatches();
    const result = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                // ...filter,
                filters: [
                    {
                        type: "ELO" as const,
                        value: 5,
                    },
                ],
                pageInfo: {
                    ...pageInfo,
                    // sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getTopMatches],
    });

    return (
        <>
            <form>
                <Card className="mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            type="submit"
                            onClick={() => client.invalidateQueries({ queryKey: [EQueryKey.getTopMatches] })}
                            className="rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <RefreshIcon className={twMerge("animate-spin")} />
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                </Card>
            </form>
        </>
    );
}
