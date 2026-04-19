import { useNavigate } from "@tanstack/react-router";

import { Player } from "../../api/model";
import { PlusIcon } from "../icons";
import { SortMode } from "../icons/SortIcon";
import Table, { Sort } from "../lib/Table";
import { useUrlSyncedTableState } from "../lib/useUrlSyncedTableState";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { PlayerRow } from "./PlayerRow";
import { PlayersFilter } from "./PlayersFilter";
import { usePlayersList } from "./usePlayersList";

export const Players = () => {
    const navigate = useNavigate();
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState({
        tableId: "players",
        defaultSorting: {
            key: "ranking",
            mode: SortMode.DESC,
        } as Sort<Player>,
    });
    const { data, fetchNextPage, isFetching } = usePlayersList(filters, sort);

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
                        <PlayersFilter filters={filters} setFilters={setFilters} />
                    </>
                }
                heading={PlayerRow.Heading}
                data={data ?? []}
                keyFn={(p) => p.uid}
                sort={sort}
                onSort={Object.fromEntries(
                    (["uid", "name", "elo", "ranking", "favourite"] as Array<keyof Player>).map((x) => [
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
