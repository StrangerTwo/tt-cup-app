import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuth = (auth: Auth) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, [auth]);

    return user;
};
