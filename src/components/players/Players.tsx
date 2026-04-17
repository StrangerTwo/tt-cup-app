import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useGetPlayers } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Player } from "../../api/model";
import { trimToUndefined } from "../../lib/empty";
import { sortingForRequest } from "../../lib/sortingForRequest";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";
import { PlusIcon } from "../icons";
import { SortMode } from "../icons/SortIcon";
import SearchInput from "../lib/SearchInput";
import Table, { Sort } from "../lib/Table";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";

export const Players = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<Sort<Player> | undefined>({
        key: "elo",
        mode: SortMode.DESC,
    });

    const { mutateAsync } = useGetPlayers();
    const { data, isFetching, fetchNextPage } = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                search: trimToUndefined(search),
                pageInfo: {
                    ...pageInfo,
                    sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getPlayers, search, sort],
    });

    return (
        <Card className="w-0 min-w-full overflow-x-auto p-0">
            <Table
                caption={
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <h1 className="text-xl">Hráči</h1>
                            <IconButton onClick={() => navigate({ to: "/players/new" })}>
                                <PlusIcon />
                            </IconButton>
                        </div>
                        <SearchInput placeholder="Jméno" value={search} onSearch={(x) => setSearch(x)} />
                    </>
                }
                heading={[
                    { label: "Jméno", key: "name" },
                    { label: "uid", key: "uid" },
                    { label: "Elo", key: "elo" },
                ]}
                data={data ?? []}
                keyFn={(p) => p.uid}
                sort={sort}
                onSort={Object.fromEntries(
                    (["uid", "name", "elo"] as Array<keyof Player>).map((x) => [
                        x,
                        (mode: SortMode | null) => setSort(mode ? { key: x, mode } : undefined),
                    ]),
                )}
                onRowClick={(p) => navigate({ to: "/player/$playerUid", params: { playerUid: p.uid } })}
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {(p) => (
                    <>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {p.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">{p.uid}</td>
                        <td className="whitespace-nowrap px-6 py-4">{p.elo}</td>
                    </>
                )}
            </Table>
        </Card>
    );
};
