import { createFileRoute } from "@tanstack/react-router";

import { PlaceRecommendations } from "../../components/places/PlaceRecommendations";

export const Route = createFileRoute("/update/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <PlaceRecommendations />;
}
