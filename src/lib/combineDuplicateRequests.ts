import { AxiosInstance, AxiosPromise, AxiosResponse } from "axios";

interface PendingRequest {
    promise: AxiosPromise;
    resolve: (value: AxiosResponse) => void;
    reject: (reason?: any) => void;
}

const pendingRequests = new Map<string, PendingRequest>();

const combineDuplicateRequests = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            if (config.method !== "GET") return config;

            const id = `${config.method}_${config.url}`;

            const pendingRequest = pendingRequests.get(id);
            if (pendingRequest) {
                config.adapter = async (config) => await pendingRequest.promise;
                return config;
            }

            let res!: (value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void;
            let rej!: (reason?: any) => void;
            const promise: AxiosPromise = new Promise((resolve, reject) => {
                res = resolve;
                rej = reject;
            });
            const request: PendingRequest = {
                promise,
                resolve: res,
                reject: rej,
            };

            pendingRequests.set(id, request);

            return config;
        },
        (error) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            const id = `${response.config.method}_${response.config.url}`;
            pendingRequests.get(id)?.resolve(response);
            pendingRequests.delete(id);
            return response;
        },
        (error) => {
            const id = `${error.config.method}_${error.config.url}`;
            pendingRequests.get(id)?.reject(error);
            pendingRequests.delete(id);
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject(error);
        },
    );
};

export default combineDuplicateRequests;
