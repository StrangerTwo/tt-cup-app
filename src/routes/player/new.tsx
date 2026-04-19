import { createFileRoute } from "@tanstack/react-router";

import { NewPlayer } from "../../components/players/NewPlayer";

export const Route = createFileRoute("/player/new")({
    component: RouteComponent,
});

function RouteComponent() {
    return <NewPlayer />;
}
