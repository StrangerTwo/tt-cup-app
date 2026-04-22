import { createFileRoute } from "@tanstack/react-router";

import { Players } from "../../components/player/players/Players";

export const Route = createFileRoute("/player/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <Players />;
}
