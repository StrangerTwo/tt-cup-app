import { Sort } from "../components/lib/Table";

export const sortingForRequest = (sorting: Array<Sort<any>>) => {
    return sorting.map((item) => {
        return `${item.key.toString()}:${item.mode}`;
    });
};
