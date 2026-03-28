import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const resolveErrorMessage = (error: any): string => {
    if (error instanceof AxiosError && error.response?.data) return String(error.response?.data);
    if (error instanceof Error) return error.message;
    return String(error);
};

export const toastError = (error: any) => {
    toast.error(resolveErrorMessage(error));
};
