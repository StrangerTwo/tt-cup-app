import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { useGetFavouriteTips, useGetTips } from "../../api/api";
import { FavouriteTip, XgTip } from "../../api/model";
import { PlusIcon } from "../../components/icons";
import { Skeleton } from "../../components/lib/Skeleton";
import { Accordion } from "../../components/ui/Accordion";
import { Card } from "../../components/ui/Card";
import { IconButton } from "../../components/ui/IconButton";
import { AddTipToTicket } from "../../components/xg-tips/AddTipToTicket";
import { TipRow } from "../../components/xg-tips/TipRow";

export const Route = createFileRoute("/xg/tickets")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: tips } = useGetTips();
    const { data: favourites } = useGetFavouriteTips();
    const [ticketCount, setTicketCount] = useState(0);

    const data = useMemo((): Array<XgTip & { tickets: FavouriteTip["tickets"] }> | undefined => {
        if (!tips || !favourites) return undefined;

        return tips
            .map((t) => {
                const favourite = favourites.find((f) => t.id === f.tipId);
                if (!favourite) return null;
                return {
                    ...t,
                    tickets: favourite.tickets,
                };
            })
            .filter((x) => !!x);
    }, [favourites, tips]);

    useEffect(() => {
        const tickets = favourites?.flatMap((f) => f.tickets ?? []) ?? [];
        const newTicketCount = tickets?.length > 0 ? Math.max(...tickets) + 1 : 0;
        if (newTicketCount > ticketCount) setTicketCount(newTicketCount);
    }, [favourites, ticketCount]);

    if (!data) {
        return <Skeleton.Card />;
    }

    return (
        <div className="flex flex-col gap-4">
            <Card layerStep={0} className="flex flex-col gap-2">
                <h1>Mega ticket</h1>
                {data.map((tip) => (
                    <TipRow tip={tip}>
                        <AddTipToTicket tip={tip} ticketCount={ticketCount} />
                    </TipRow>
                ))}
            </Card>
            <h2>Tickety</h2>
            {Array.from({ length: ticketCount }, (v, i) => i).map((i) => (
                <Accordion size="sm" title={`Ticket ${i + 1}`} isOpen={data.some((t) => t.tickets?.includes(i))}>
                    <div className="flex flex-col gap-2">
                        {data
                            .filter((t) => t.tickets?.includes(i))
                            .map((tip) => (
                                <TipRow tip={tip}></TipRow>
                            ))}
                        Celkem ticketů: {data.filter((t) => t.tickets?.includes(i)).length}
                    </div>
                </Accordion>
            ))}
            <IconButton onClick={() => setTicketCount((x) => x + 1)}>
                <PlusIcon />
            </IconButton>
        </div>
    );
}
