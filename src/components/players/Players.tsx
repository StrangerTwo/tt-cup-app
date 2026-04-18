import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { EQueryKey } from "../../api/EQueryKey";
import { Location, Player } from "../../api/model";
import { BoxSelect } from "../form/BoxSelect";
import { Input } from "../form/Input";
import { PlusIcon, SearchIcon } from "../icons";
import { SortMode } from "../icons/SortIcon";
import Table, { Sort } from "../lib/Table";
import { TableCell } from "../lib/TableCell";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { FavouritePlayerButton } from "./FavouritePlayerButton";
import { PlayersFilterFormType, playersFilterSchema } from "./playersFilterSchema";
import { usePlayersList } from "./usePlayersList";

export const Players = () => {
    const client = useQueryClient();
    const navigate = useNavigate();
    const [playersFilter, setPlayersFilter] = useState<PlayersFilterFormType>();
    const form = useForm({
        resolver: yupResolver(playersFilterSchema),
    });
    const [sort, setSort] = useState<Sort<Player> | undefined>({
        key: "elo",
        mode: SortMode.DESC,
    });
    const { data, fetchNextPage, isFetching } = usePlayersList(playersFilter, sort);

    const onSubmit = (filter: PlayersFilterFormType) => {
        setPlayersFilter(filter);
        if (!form.formState.isDirty) {
            client.invalidateQueries({ queryKey: [EQueryKey.getPlayers] });
            form.reset(form.getValues());
        }
    };

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
                        <form className="grid max-w-sm grid-cols-[1fr_auto]" onSubmit={form.handleSubmit(onSubmit)}>
                            <Input form={form} name="search" placeholder="Jméno" />
                            <button
                                type="submit"
                                className="ms-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <SearchIcon />
                                <span className="sr-only">Search</span>
                            </button>
                            <BoxSelect
                                form={form}
                                name="location"
                                className="col-span-full mt-2"
                                options={Object.entries(Location).map(([label, value]) => ({ label, value }))}
                            />
                        </form>
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
