import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Player } from "../../api/model";
import { PlusIcon } from "../icons";
import { SortMode } from "../icons/SortIcon";
import Table, { Sort } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { FavouritePlayerButton } from "./FavouritePlayerButton";
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
                            <IconButton onClick={() => navigate({ to: "/players/new" })}>
                                <PlusIcon />
                            </IconButton>
                        </div>
                        <PlayersFilter setPlayersFilter={setPlayersFilter} />
                    </>
                }
                heading={[
                    { label: "#" },
                    { label: "Jméno hráče", key: "name" },
                    { label: "Ranking", key: "elo" },
                    { label: "Elo" },
                    { label: "Oblíbené", key: "favourite" },
                    { label: "uid", key: "uid" },
                ]}
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
                {(p, i) => (
                    <>
                        <TableCell>{i + 1}.</TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white">{p.name}</TableCell>
                        <TableCell>
                            <span className="me-1 align-middle">{p.elo}</span>
                            <Card className="inline-flex size-[1.5em] items-center justify-center p-0 align-middle md:p-0">
                                {p.location ?? ""}
                            </Card>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                            <FavouritePlayerButton playerUid={p.uid} className={"size-5 align-middle"} />
                        </TableCell>
                        <TableCell>{p.uid}</TableCell>
                    </>
                )}
            </Table>
        </Card>
    );
};
