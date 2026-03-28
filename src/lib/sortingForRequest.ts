import { SortMode } from "../components/icons/SortIcon";

export const sortingForRequest = (
    sorting: Array<{
        key: string;
        mode: SortMode;
    }>,
) => {
    return sorting.map((item) => {
        return `${item.key}:${item.mode === SortMode.DESC ? "desc" : "asc"}`;
    });
};
