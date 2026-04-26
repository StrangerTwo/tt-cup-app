import { createFileRoute } from "@tanstack/react-router";

import { Tabs } from "../../components/lib/Tabs";
import { OutdatedPlaces } from "../../components/place/outdated/OutdatedPlaces";
import { updateTabs } from ".";

export const Route = createFileRoute("/update/outdated")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Tabs tabs={updateTabs} value={"outdated"} />
            <OutdatedPlaces />
        </>
    );
}
