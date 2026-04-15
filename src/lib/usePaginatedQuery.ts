import { type QueryKey, useInfiniteQuery, type UseMutateAsyncFunction } from "@tanstack/react-query";

import { PageInfoRequest } from "../api/model";

interface Props<TData, TResponse, TError, TVariables> {
    initialPagination?: PageInfoRequest;
    dataFn: (response: TResponse) => Array<TData>;
    totalPagesFn: (response: TResponse) => number | undefined;
    paramFn: (pageInfo: PageInfoRequest) => TVariables;
    mutateAsync: UseMutateAsyncFunction<TResponse, TError, TVariables, unknown>;
    queryKey: QueryKey;
    enabled?: boolean;
    refetchInterval?: number;
}

const defaultPagination = { page: 0, size: 20 };

export const usePaginatedQuery = <TData, TResponse, TError, TVariables>({
    mutateAsync,
    dataFn,
    totalPagesFn,
    paramFn,
    queryKey,
    initialPagination = defaultPagination,
    enabled = true,
    refetchInterval,
}: Props<TData, TResponse, TError, TVariables>) => {
    const result = useInfiniteQuery({
        queryKey,
        initialPageParam: 0,
        queryFn: ({ pageParam = 0 }) => mutateAsync(paramFn({ ...initialPagination, page: pageParam })),
        getNextPageParam: (lastPage, allPages) => {
            const totalPages = totalPagesFn(lastPage) ?? 0;
            return allPages.length < totalPages ? allPages.length : undefined;
        },
        enabled,
        refetchInterval,
    });

    return {
        ...result,
        data: result.data?.pages.flatMap(dataFn),
    };
};
