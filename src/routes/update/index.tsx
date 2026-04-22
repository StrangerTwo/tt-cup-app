import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Tabs } from "../../components/lib/Tabs";
import { OutdatedPlaces } from "../../components/place/outdated/OutdatedPlaces";
import { PlaceRecommendations } from "../../components/place/recommendations/PlaceRecommendations";

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
    const tab = search.tab || "all";

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
                    content: <></>,
                },
                {
                    header: "Přidat halu",
                    value: "add",
                    content: <PlaceRecommendations />,
                },
            ]}
            value={tab}
            onSelect={selectTab}
        />
    );
}
