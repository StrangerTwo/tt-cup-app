import { useQueryClient } from "@tanstack/react-query";

import { getGetPlaceQueryKey, useGetPlaces } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { GetPlacesRequest, Place } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";

export const usePlaces = (filter: Omit<GetPlacesRequest, "pageInfo"> | undefined, sort?: Sort<Place>) => {
    const client = useQueryClient();
    const { mutateAsync } = useGetPlaces();
    const result = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                ...filter,
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getPlaces, filter, sort],
        onfulfilled: (res) => {
            res.results.forEach((place) => {
                client.setQueryData(getGetPlaceQueryKey(place.uid), (x: Place | undefined) => place);
            });
        },
    });

    return result;
};
