import { getHello } from "../api/api";

const isDev = import.meta.env.VITE_IS_DEV === "true";

const prodUrl = "https://api.ttcup.dev.mhdonline.cz/";
const devUrl = "http://127.0.0.1:8080/";

let isDevWorkingCheck: Promise<boolean> | null = null;

const checkIfDevWorks = () => {
    if (isDevWorkingCheck !== null) return isDevWorkingCheck;
    return (isDevWorkingCheck = getHello({ baseURL: devUrl })
        .then((res) => !!res)
        .catch((error) => false));
};

export const getBaseUrl = async () => {
    if (!isDev) return prodUrl;
    return (await checkIfDevWorks()) ? devUrl : prodUrl;
};
