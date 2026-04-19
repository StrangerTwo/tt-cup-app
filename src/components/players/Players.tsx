import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Player } from "../../api/model";
import { PlusIcon } from "../icons";
import { SortMode } from "../icons/SortIcon";
import Table, { Sort } from "../lib/Table";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { PlayerRow } from "./PlayerRow";
import { PlayersFilter } from "./PlayersFilter";
import { PlayersFilterFormType } from "./playersFilterSchema";
import { usePlayersList } from "./usePlayersList";

export const Players = () => {
    const navigate = useNavigate();
    const [playersFilter, setPlayersFilter] = useState<PlayersFilterFormType>();
    const [sort, setSort] = useState<Sort<Player> | undefined>({
        key: "elo",
        mode: SortMode.DESC,
    });
    const { data, fetchNextPage, isFetching } = usePlayersList(playersFilter, sort);

    return (
        <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
            <Table
                caption={
                    <>
                        <div className="mb-1 flex items-center gap-4 md:mb-4">
                            <h1 className="text-xl">Hráči</h1>
                            <IconButton onClick={() => navigate({ to: "/player/new" })}>
                                <PlusIcon />
                            </IconButton>
                        </div>
                        <PlayersFilter setPlayersFilter={setPlayersFilter} />
                    </>
                }
                heading={PlayerRow.Heading}
                data={data ?? []}
                keyFn={(p) => p.uid}
                sort={sort}
                onSort={Object.fromEntries(
                    (["uid", "name", "elo", "favourite"] as Array<keyof Player>).map((x) => [
                        x,
                        (mode: SortMode | null) => setSort(mode ? { key: x, mode } : undefined),
                    ]),
                )}
                onRowClick={(p) => navigate({ to: "/player/$playerUid", params: { playerUid: p.uid } })}
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {(p, i) => <PlayerRow.FC player={p} i={i} />}
            </Table>
        </Card>
    );
};
