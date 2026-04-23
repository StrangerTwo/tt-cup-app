import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { useGetTournamentsToday } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";

export const Route = createFileRoute("/tournament/")({
    component: RouteComponent,
});

function RouteComponent() {
    const client = useQueryClient();
    const { mutateAsync } = useGetTournamentsToday();
    const { data } = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                // ...filter,
                pageInfo: {
                    ...pageInfo,
                    // sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getTournamentsToday],
        // onfulfilled: (res) => {
        //     res.results.forEach((place) => {
        //         client.setQueryData(getGetPlaceQueryKey(place.uid), (x: Place | undefined) => place);
        //     });
        // },
    });

    return <div>Hello "/tournament/"!</div>;
}
