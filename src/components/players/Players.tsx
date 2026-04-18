import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Player } from "../../api/model";
import { PlusIcon } from "../icons";
import { SortMode } from "../icons/SortIcon";
import SearchInput from "../lib/SearchInput";
import Table, { Sort } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { FavouritePlayerButton } from "./FavouritePlayerButton";
import { usePlayersList } from "./usePlayersList";

export const Players = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<Sort<Player> | undefined>({
        key: "elo",
        mode: SortMode.DESC,
    });
    const { data, fetchNextPage, isFetching } = usePlayersList(search, sort);

    return (
        <Card className="w-0 min-w-full overflow-x-auto p-0 md:p-0">
            <Table
                caption={
                    <>
                        <div className="mb-1 flex items-center gap-4 md:mb-4">
                            <h1 className="text-xl">Hráči</h1>
                            <IconButton onClick={() => navigate({ to: "/players/new" })}>
                                <PlusIcon />
                            </IconButton>
                        </div>
                        <SearchInput placeholder="Jméno" value={search} onSearch={(x) => setSearch(x)} />
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
                        <TableCell>{p.elo}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                            <FavouritePlayerButton playerUid={p.uid} />
                        </TableCell>
                        <TableCell>{p.uid}</TableCell>
                    </>
                )}
            </Table>
        </Card>
    );
};
