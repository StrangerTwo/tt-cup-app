import { useNavigate } from "@tanstack/react-router";

import { PlayerSummary } from "../../../api/model";
import { PlusIcon } from "../../icons";
import { SortMode } from "../../icons/SortIcon";
import Table, { Sort } from "../../lib/Table";
import { useUrlSyncedTableState } from "../../lib/useUrlSyncedTableState";
import { Card } from "../../ui/Card";
import { IconButton } from "../../ui/IconButton";
import { PlayerRow } from "./PlayerRow";
import { PlayersFilter } from "./PlayersFilter";
import { PlayersFilterFormType } from "./playersFilterSchema";
import { usePlayers } from "./usePlayers";

export const Players = () => {
    const navigate = useNavigate();
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState<PlayersFilterFormType, PlayerSummary>({
        tableId: "players",
        defaultSorting: [
            {
                key: "player.ranking",
                mode: SortMode.DESC,
            },
        ],
    });
    const { data, fetchNextPage, isFetching } = usePlayers(filters, sort);

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
                        <PlayersFilter filters={filters} setFilters={setFilters} isFetching={isFetching} />
                    </>
                }
                heading={PlayerRow.Heading}
                data={data ?? []}
                keyFn={(p) => p.player.uid}
                sort={sort?.[0]}
                onSort={Object.fromEntries(
                    (
                        [
                            "player.uid",
                            "player.name",
                            "player.elo",
                            "player.ranking",
                            "player.favourite",
                            "summary.winRate",
                        ] as Array<Sort<PlayerSummary>["key"]>
                    ).map((x) => [x, (mode: SortMode | null) => setSort(mode ? [{ key: x, mode }] : undefined)]),
                )}
                onRowClick={({ player }) => navigate({ to: "/player/$playerUid", params: { playerUid: player.uid } })}
                onLoadMore={fetchNextPage}
                isPending={isFetching}>
                {({ player, summary }, i) => <PlayerRow.FC playerUid={player.uid} i={i} />}
            </Table>
        </Card>
    );
};
