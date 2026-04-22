import { createFileRoute } from "@tanstack/react-router";

import { NewPlayer } from "../../components/player/new/NewPlayer";

export const Route = createFileRoute("/player/new")({
    component: RouteComponent,
});

function RouteComponent() {
    return <NewPlayer />;
}
