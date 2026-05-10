import { createFileRoute, redirect } from "@tanstack/react-router";

import { TabItem } from "../../components/lib/Tabs";

export const Route = createFileRoute("/update/")({
    loader: () =>
        redirect({
            to: "/update/crawl",
            replace: true,
        }),
});

export const updateTabs: Array<TabItem<"crawl" | "places">> = [
    {
        header: "Update",
        value: "crawl",
        navigateFn: (navigate) => navigate({ to: "/update/crawl" }),
    },
    {
        header: "Haly",
        value: "places",
        navigateFn: (navigate) => navigate({ to: "/update/places" }),
    },
];
