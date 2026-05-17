export const getNested = <T, R>(obj: T, path: string | Array<keyof T> | undefined): R | undefined => {
    if (!path || !obj) return undefined;

    const pathArray = Array.isArray(path) ? path : path.split(".");

    return pathArray.reduce<unknown>((acc, part) => acc?.[part as keyof typeof acc], obj) as R;
};
