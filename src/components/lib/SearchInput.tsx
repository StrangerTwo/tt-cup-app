import { ChangeEventHandler, FC, FormEventHandler, ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useColorLayer } from "../ui/layout/ColorLayer";
import { SearchIcon } from "../icons";

interface Props {
    className?: string;
    icon?: ReactNode;
    placeholder?: string;
    value?: string;
    onSearch: (value: string) => void;
    id?: string;
}

export const SearchInput: FC<Props> = ({ className, icon, placeholder, value: overrideValue, onSearch, id }) => {
    const [value, setValue] = useState("");
    const { bgColor, borderColor } = useColorLayer();
    useEffect(() => {
        if (typeof overrideValue !== "string") return;
        setValue(overrideValue);
    }, [overrideValue]);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value);
        onSearch(e.target.value);
    };

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        onSearch(value);
    };

    return (
        <form className={twMerge("flex max-w-sm items-center", className)} onSubmit={onSubmit}>
            <label htmlFor={id} className="sr-only">
                Search
            </label>
            <div className="relative w-full">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">{icon}</div>
                )}
                <input
                    type="search"
                    id={id}
                    value={value}
                    onChange={onChange}
                    className={twMerge(
                        bgColor,
                        borderColor,
                        "block w-full rounded-lg border  p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500  dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
                        icon && "ps-10",
                    )}
                    placeholder={placeholder}
                    required
                />
            </div>
            <button
                type="submit"
                className="ms-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <SearchIcon />
                <span className="sr-only">Search</span>
            </button>
        </form>
    );
};

export default SearchInput;
