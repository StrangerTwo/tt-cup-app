import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

import { Player } from "../../api/model";
import { RenderItem } from "../lib/RenderItem";
import { Card } from "../ui/Card";

interface Props {
    player: Player;
    className?: string;
}

export const RivalInfoCard = ({ player, className }: Props) => {
    return (
        <Card className={twMerge("max-w-md", className)}>
            <dl className="grid grow grid-cols-2 gap-2 md:gap-4">
                <RenderItem title={"Jméno:"} className="col-span-full">
                    <Link to="/player/$playerUid" params={{ playerUid: player.uid }} className="underline">
                        {player.name}
                    </Link>
                </RenderItem>

                <RenderItem title={"Ranking:"} className="col-start-1">
                    {player.ranking}
                </RenderItem>
                <RenderItem title={"Elo:"}>{player.elo}</RenderItem>
                <RenderItem title={"Poznámka:"} className="col-span-full">
                    {player.note}
                </RenderItem>
            </dl>
        </Card>
    );
};
