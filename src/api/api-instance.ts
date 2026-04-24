import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { getAxiosInstance } from "../lib/axios";
import cache404Responses from "../lib/cache404Responses";
import combineDuplicateRequests from "../lib/combineDuplicateRequests";

export const API_AXIOS_INSTANCE = axios.create();
combineDuplicateRequests(API_AXIOS_INSTANCE);
cache404Responses(API_AXIOS_INSTANCE);

export function customInstance<T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> {
    return getAxiosInstance(API_AXIOS_INSTANCE, config, options);
}

export type ErrorType<Error> = AxiosError<Error>;
