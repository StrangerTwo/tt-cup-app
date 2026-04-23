export const renderNameShort = (name: string | undefined) => {
    return name?.slice(0, name.indexOf(" ") + 2);
};
