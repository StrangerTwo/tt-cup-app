export const trimToUndefined = (value: string | undefined) => {
    const result = value?.trim();
    return result === "" ? undefined : result;
};
