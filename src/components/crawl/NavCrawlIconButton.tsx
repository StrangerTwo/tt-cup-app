import { SubmitButton } from "../lib/SubmitButton";
import { useCrawl } from "./useCrawl";

export const NavCrawlIconButton = () => {
    const { data, going, onGoRecursiveBtnClick } = useCrawl();

    if (!data?.pageInfo.totalElements) return null;

    return (
        <SubmitButton
            type="button"
            className="h-10 min-w-10 justify-center bg-blue-700 px-2 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => onGoRecursiveBtnClick()}
            loading={going}>
            {data?.pageInfo.totalElements}
        </SubmitButton>
    );
};
