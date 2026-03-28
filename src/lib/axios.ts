import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { getBaseUrl } from "./baseUrl";

export async function getAxiosInstance<T>(
    instance: AxiosInstance,
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
) {
    const contentType: string | undefined = options?.headers?.["Content-Type"] ?? config?.headers?.["Content-Type"];
    const source = axios.CancelToken.source();
    const promise = instance({
        ...config,
        ...options,
        baseURL: config.baseURL || options?.baseURL || (await getBaseUrl()),
        headers: {
            ...config?.headers,
            ...options?.headers,
            "Content-Type": contentType || "application/json",
            Accept: "application/json",
        },
        cancelToken: source.token,
    }).then(({ data }: AxiosResponse<T>) => data);

    // @ts-ignore adding a cancel method for react-query
    promise.cancel = () => {
        source.cancel("Query was cancelled by React Query");
    };

    return promise;
}
