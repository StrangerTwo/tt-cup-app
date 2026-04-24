import { AxiosInstance } from "axios";

const cache404Responses = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 404) {
                // 👇 convert 404 into resolved response
                return Promise.resolve({
                    ...error.response,
                    data: null,
                });
            }

            return Promise.reject(new Error(error));
        },
    );
};

export default cache404Responses;
