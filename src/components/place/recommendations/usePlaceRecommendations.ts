import { useGetPlaceRecommendations } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { GetPlaceRecommendationsRequest, TournamentMatches } from "../../../api/model";
import { sortingForRequest } from "../../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../../lib/usePaginatedQuery";
import { Sort } from "../../lib/Table";

export const usePlaceRecommendations = (
    filter: Omit<GetPlaceRecommendationsRequest, "pageInfo"> | undefined,
    sort?: Sort<TournamentMatches>,
) => {
    const { mutateAsync } = useGetPlaceRecommendations();
    return usePaginatedQuery({
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
        queryKey: [EQueryKey.getPlaceRecommendations, filter, sort],
    });
};
