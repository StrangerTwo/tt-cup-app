import { createFileRoute } from "@tanstack/react-router";

import { TournamentsToday } from "../../components/tournament/TournamentsToday";

export const Route = createFileRoute("/tournament/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <TournamentsToday />;
}
