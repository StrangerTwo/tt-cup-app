import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";

import { useGetTips } from "../../api/api";
import { XgTip } from "../../api/model";
import { Skeleton } from "../../components/lib/Skeleton";
import { RefreshTips } from "../../components/xg-tips/RefreshTips";
import { TipFilters } from "../../components/xg-tips/TipFilters";
import { TipGroup } from "../../components/xg-tips/TipGroup";

export const Route = createFileRoute("/xg/tips")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: tips } = useGetTips();
    const [filters, setFilters] = useState<Array<(tip: XgTip) => boolean>>([]);

    const groups = useMemo(() => {
        const res = {} as { [_: string]: Array<XgTip> };
        if (!tips) return res;

        tips.forEach((tip) => {
            if (filters.some((filter) => !filter(tip))) return;

            const datetime = parseISO(tip.datetime);
            const key = `${tip.tournament.country}-${tip.tournament.name}-${format(datetime, "MMdd")}`;
            res[key] = [...(res[key] || []), tip];
        });
        return res;
    }, [tips, filters]);

    if (!groups) return <Skeleton.Card />;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl">Tipy na sázení</h1>
                <RefreshTips />
            </div>

            <TipFilters setFilters={setFilters} />

            {Object.entries(groups).map(([key, group]) => (
                <TipGroup key={key} group={group} />
            ))}
        </div>
    );
}
