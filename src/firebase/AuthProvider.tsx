import { Auth } from "firebase/auth";
import { FC, ReactNode, useEffect, useState } from "react";

import { getUser } from "../api/api";
import { API_AXIOS_INSTANCE } from "../api/api-instance";
import { User } from "../api/model";
import { toastError } from "../lib/toastError";
import { useAuth } from "../lib/useAuth";
import { AuthContext } from "./AuthContext";

interface Props {
    auth: Auth;
    children: ReactNode;
    unAuthTemp?: ReactNode;
}

enum InterceptorState {
    NOT_SETTING,
    CHECKING,
    SET,
}

export const AuthProvider: FC<Props> = ({ auth, children, unAuthTemp }) => {
    const [interceptorState, setInterceptorState] = useState<InterceptorState>(InterceptorState.CHECKING);
    const user = useAuth(auth);
    const [apiUser, setUser] = useState<User>();

    useEffect(() => {
        if (!user) {
            setInterceptorState(InterceptorState.NOT_SETTING);
            return;
        }
        const id = API_AXIOS_INSTANCE.interceptors.request.use(async (config) => {
            config.headers.authorization = `Bearer ${await user?.getIdToken()}`;
            return config;
        });
        setInterceptorState(InterceptorState.SET);
        return () => API_AXIOS_INSTANCE.interceptors.request.eject(id);
    }, [user]);

    useEffect(() => {
        setUser(undefined);
        if (!user) return;

        getUser()
            .then((x) => setUser(x))
            .catch(toastError);
    }, [user]);

    if (interceptorState == InterceptorState.CHECKING) {
        return unAuthTemp;
    }

    if (unAuthTemp && interceptorState !== InterceptorState.SET) {
        return unAuthTemp;
    }

    return <AuthContext.Provider value={{ user: apiUser }}>{children}</AuthContext.Provider>;
};
