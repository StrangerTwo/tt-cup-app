export const renderNameShort = (name: string | undefined, firstLetter = false) => {
    return name?.slice(0, name.indexOf(" ") + (firstLetter ? 2 : 0));
};
