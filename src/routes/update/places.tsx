import { createFileRoute } from "@tanstack/react-router";

import { Tabs } from "../../components/lib/Tabs";
import { Places } from "../../components/place/places/Places";
import { updateTabs } from ".";

export const Route = createFileRoute("/update/places")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Tabs tabs={updateTabs} value={"places"} />
            <Places />
        </>
    );
}
