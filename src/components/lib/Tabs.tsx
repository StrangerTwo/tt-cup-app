import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface TabItem {
    value: string;
    header: ReactNode;
    content: ReactNode;
}

interface Props {
    value: string;
    tabs: Array<TabItem>;
    onSelect: (x: string) => void;
}

export const Tabs: FC<Props> = ({ value, tabs, onSelect }) => {
    const selectedTab = tabs.find((tab) => tab.value === value);

    return (
        <>
            <div className="mb-2 border-b border-gray-200 dark:border-gray-700 md:mb-4">
                <ul className="-mb-px flex flex-wrap justify-evenly text-center text-sm font-medium" role="tablist">
                    {tabs.map((tab, i) => (
                        <li key={i} className="me-2" role="presentation">
                            <button
                                className={twMerge(
                                    "group inline-flex items-center justify-center gap-2 rounded-t-lg border-b-2 border-transparent p-2 md:p-4",
                                    tab === selectedTab
                                        ? "border-blue-600 dark:border-blue-500 dark:text-blue-500"
                                        : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300",
                                )}
                                type="button"
                                role="tab"
                                onClick={() => onSelect(tab.value)}
                                aria-controls={tab.value}
                                aria-selected={tab === selectedTab}>
                                {tab.header}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedTab?.content}
        </>
    );
};
