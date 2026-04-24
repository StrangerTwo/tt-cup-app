import { useState } from "react";

import { Player } from "../../api/model";
import { EditIcon } from "../icons";
import { RenderItem } from "../lib/RenderItem";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { EditPlayerForm } from "./edit/EditPlayerForm";

interface Props {
    player: Player;
}

export const PlayerDataCard = ({ player }: Props) => {
    const [isEdit, setIsEdit] = useState(false);

    return (
        <Card className="mt-2 flex max-w-xl justify-between gap-2 md:mt-4 md:gap-4">
            {isEdit ? (
                <EditPlayerForm player={player} className="grow" onSubmit={() => setIsEdit(false)} />
            ) : (
                <dl className="grid grow grid-cols-2 gap-2 md:gap-4">
                    <RenderItem title={"Ranking:"}>{player.ranking}</RenderItem>
                    <RenderItem title="Lokace:">
                        <Card className="inline-flex size-[1.5em] items-center justify-center p-0 align-middle md:p-0">
                            {player.location ?? ""}
                        </Card>
                    </RenderItem>
                    <RenderItem title={"Elo:"}>{player.elo}</RenderItem>
                    <RenderItem title={"Stis id:"}>
                        <a className="underline" href={`https://stis.ping-pong.cz/hrac-${player.stisId}`}>
                            {player.stisId}
                        </a>
                    </RenderItem>
                    <RenderItem title={"Poznámka:"} className="col-span-full" column>
                        {player.note}
                    </RenderItem>
                </dl>
            )}
            <IconButton onClick={() => setIsEdit((x) => !x)}>
                <EditIcon />
            </IconButton>
        </Card>
    );
};
