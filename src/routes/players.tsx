import { createFileRoute } from "@tanstack/react-router";

import { Players } from "../components/players/Players";

export const Route = createFileRoute("/players")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <h1 className="mb-4 text-xl">Hráči</h1>
            <Players />
        </>
    );
}
