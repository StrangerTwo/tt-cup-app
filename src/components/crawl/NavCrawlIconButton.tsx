import { twMerge } from "tailwind-merge";

import { RefreshIcon } from "../icons";
import { IconButton } from "../ui/IconButton";
import { useCrawl } from "./useCrawl";

export const NavCrawlIconButton = () => {
    const { data, going, onGoRecursiveBtnClick } = useCrawl();

    if (!data?.pageInfo.totalElements) return null;

    return (
        <IconButton
            type="button"
            className="bg-blue-700 text-white hover:bg-blue-800  dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => onGoRecursiveBtnClick()}>
            <RefreshIcon className={twMerge(going && "animate-spin")} />
        </IconButton>
    );
};
