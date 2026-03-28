import { createContext } from "react";

import { User } from "../api/model";

export interface AuthContext {
    user: User | undefined;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);
