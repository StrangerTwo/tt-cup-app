import { createFileRoute } from "@tanstack/react-router";

import { Players } from "../../components/players/Players";

export const Route = createFileRoute("/player/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <Players />;
}
