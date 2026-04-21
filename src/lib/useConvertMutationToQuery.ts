import { type UseMutationResult, useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";

interface ConvertMutationToQueryOptions<TData, TError, TVariables>
    extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
    queryKey: Array<unknown>;
    variables: TVariables;
}

export function useConvertMutationToQuery<TData, TError, TVariables>(
    mutation: UseMutationResult<TData, TError, TVariables>,
    options: ConvertMutationToQueryOptions<TData, TError, TVariables>,
): UseQueryResult<TData, TError> {
    const { queryKey, variables, enabled = true, ...queryOptions } = options;

    // Create a query that wraps the mutation
    return useQuery<TData, TError>({
        queryKey,
        queryFn: async () => {
            return mutation.mutateAsync(variables);
        },
        enabled,
        ...queryOptions,
    });
}
