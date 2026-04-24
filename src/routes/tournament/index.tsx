import { createFileRoute } from "@tanstack/react-router";

import { TournamentsToday } from "../../components/tournaments/today/TournamentsToday";

export const Route = createFileRoute("/tournament/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <TournamentsToday />;
}
