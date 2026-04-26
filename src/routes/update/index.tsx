import { createFileRoute, redirect } from "@tanstack/react-router";

import { TabItem } from "../../components/lib/Tabs";

export const Route = createFileRoute("/update/")({
    loader: () =>
        redirect({
            to: "/update/places",
            replace: true,
        }),
});

export const updateTabs: Array<TabItem<"outdated" | "places">> = [
    {
        header: "Update",
        value: "outdated",
        navigateFn: (navigate) => navigate({ to: "/update/outdated" }),
    },
    {
        header: "Haly",
        value: "places",
        navigateFn: (navigate) => navigate({ to: "/update/places" }),
    },
];
