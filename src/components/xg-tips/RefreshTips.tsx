import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import { getGetTipsQueryKey, useRefreshTips } from "../../api/api";
import { resolveErrorMessage } from "../../lib/toastError";
import { RefreshIcon } from "../icons";
import { IconButton } from "../ui/IconButton";

export const RefreshTips: FC = () => {
    const client = useQueryClient();
    const { mutateAsync, isPending } = useRefreshTips();

    const refresh = () => {
        toast.promise(
            mutateAsync().then((res) => {
                client.invalidateQueries({ queryKey: getGetTipsQueryKey() });
            }),
            {
                loading: "Aktualizuji..",
                success: "Zaktualizováno",
                error: resolveErrorMessage,
            },
        );
    };

    return (
        <IconButton onClick={refresh} border>
            <RefreshIcon className={twMerge(isPending && "animate-spin")} />
        </IconButton>
    );
};
