import { createFileRoute } from "@tanstack/react-router";

import { useGetMatchFilters } from "../../api/api";
import { Skeleton } from "../../components/lib/Skeleton";
import { TopMatches } from "../../components/match/top/TopMatches";

export const Route = createFileRoute("/top/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: defaultFilters } = useGetMatchFilters();

    if (!defaultFilters) return <Skeleton.Card />;

    return <TopMatches defaultFilters={defaultFilters} />;
}
