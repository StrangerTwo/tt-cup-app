import { parseISO } from "date-fns";
import { FC, ReactNode } from "react";

import { XgTip } from "../../api/model";
import { Card } from "../ui/Card";
import { TeamName } from "./TeamName";

interface Props {
    tip: XgTip;
    children?: ReactNode;
}

export const TipRow: FC<Props> = ({ tip, children }) => {
    return (
        <Card
            className="grid grid-cols-[auto_auto_max-content] place-items-center md:flex md:grid-cols-1 md:justify-between md:gap-2 md:px-2 md:py-1"
            hoverEffects
            onClick={() => {
                globalThis.location.href = tip.url;
            }}>
            <span className="order-1 md:w-48">
                {parseISO(tip.datetime).toLocaleTimeString("cs", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
            <div className="order-2 col-span-full flex grow gap-2 justify-self-stretch">
                <TeamName team={tip.homeTeam} />
                <Card className="flex w-28 overflow-hidden p-0 md:p-0">
                    <span className="flex grow items-center justify-center bg-teal-300 px-1 font-bold dark:bg-teal-800">
                        {tip.homeTeam.forecastScore}
                    </span>
                    <span className="flex grow items-center justify-center bg-purple-300 px-1 font-bold dark:bg-purple-800">
                        {tip.awayTeam.forecastScore}
                    </span>
                </Card>
                <TeamName team={tip.awayTeam} className="flex-row-reverse justify-self-start" />
            </div>
            <span className="order-1 md:order-3 md:w-48">
                {tip.recommendation}: {tip.recommendationChance}
            </span>
            {children && <div className="order-1 md:order-4">{children}</div>}
        </Card>
    );
};
