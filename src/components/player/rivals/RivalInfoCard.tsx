import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

import { useGetPlayer } from "../../../api/api";
import { Player } from "../../../api/model";
import { RenderItem } from "../../lib/RenderItem";
import { Skeleton } from "../../lib/Skeleton";
import { Card } from "../../ui/Card";

interface Props {
    playerUid: Player["uid"];
    className?: string;
}

export const RivalInfoCard = ({ playerUid, className }: Props) => {
    const { data: player } = useGetPlayer(playerUid);

    if (!player) return <Skeleton.Card />;

    return (
        <Card className={twMerge("max-w-md", className)}>
            <dl className="grid grow grid-cols-2 gap-2 md:gap-4">
                <RenderItem title={"Jméno:"} className="col-span-full">
                    <Link to="/player/$playerUid" params={{ playerUid: player.uid }} className="underline">
                        {player.name}
                    </Link>
                </RenderItem>

                <RenderItem title={"Ranking:"} className="col-start-1">
                    <a className="underline" href={`https://ttcup.com/players/${player.uid}/`} target="_blank">
                        {player.ranking ?? "---"}
                    </a>
                </RenderItem>
                <RenderItem title={"Elo:"}>
                    <a className="underline" href={`https://stis.ping-pong.cz/hrac-${player.stisId}`} target="_blank">
                        {player.elo}
                    </a>
                </RenderItem>
                <RenderItem title={"Poznámka:"} className="col-span-full">
                    {player.note}
                </RenderItem>
            </dl>
        </Card>
    );
};
