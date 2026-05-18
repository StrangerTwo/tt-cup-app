export const capitalizeFirstLetter = (text?: string, lowerCaseRest = true): string => {
    if (!text || text.length === 0) {
        return "";
    }
    const firstChar = text.charAt(0).toUpperCase();
    let rest = text.slice(1);
    if (lowerCaseRest) {
        rest = rest.toLowerCase();
    }

    return firstChar + rest;
};
