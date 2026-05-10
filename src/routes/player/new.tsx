import { createFileRoute } from "@tanstack/react-router";

import { NewPlayer } from "../../components/player/new/NewPlayer";

export const Route = createFileRoute("/player/new")({
    component: RouteComponent,
    validateSearch: (search) => {
        return {
            uid: search.uid,
        } as {
            uid?: string;
        };
    },
});

function RouteComponent() {
    return <NewPlayer />;
}
