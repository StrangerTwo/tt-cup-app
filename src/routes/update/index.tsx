import { createFileRoute } from "@tanstack/react-router";

import { PlaceRecommendations } from "../../components/place/recommendations/PlaceRecommendations";

export const Route = createFileRoute("/update/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <PlaceRecommendations />;
}
