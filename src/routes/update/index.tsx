import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Tabs } from "../../components/lib/Tabs";
import { OutdatedPlaces } from "../../components/place/outdated/OutdatedPlaces";
import { Places } from "../../components/place/places/Places";

export const Route = createFileRoute("/update/")({
    component: RouteComponent,
    validateSearch: (search) => {
        return {
            tab: search.tab,
        } as {
            tab?: string;
        };
    },
});

function RouteComponent() {
    const navigate = useNavigate();
    const search = Route.useSearch();
    const tab = search.tab || "places";

    const selectTab = (tab: string) => {
        navigate({ to: "/update", search: { tab }, replace: true });
    };
    return (
        <Tabs
            tabs={[
                {
                    header: "Update",
                    value: "all",
                    content: <OutdatedPlaces />,
                },
                {
                    header: "Haly",
                    value: "places",
                    content: <Places />,
                },
            ]}
            value={tab}
            onSelect={selectTab}
        />
    );
}
