import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Players } from "../../components/players/Players";

export const Route = createFileRoute("/players/")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();

    return (
        <>
            <Players />
        </>
    );
}
