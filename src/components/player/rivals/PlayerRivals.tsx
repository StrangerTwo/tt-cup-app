import { useNavigate } from "@tanstack/react-router";

import { Player, RivalMatchesSummary } from "../../../api/model";
import { SortMode } from "../../icons/SortIcon";
import Table, { Sort } from "../../lib/Table";
import { useUrlSyncedTableState } from "../../lib/useUrlSyncedTableState";
import { Card } from "../../ui/Card";
import { PlayerRivalsFilter } from "./PlayerRivalsFilter";
import { RivalRow } from "./RivalRow";
import { usePlayerRivals } from "./usePlayerRivals";

interface Props {
    playerUid: Player["uid"];
}

export const PlayerRivals = ({ playerUid }: Props) => {
    const navigate = useNavigate();
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState({
        tableId: "playerRivals",
        defaultSorting: {
            key: "rival.elo",
            mode: SortMode.DESC,
        } as Sort<RivalMatchesSummary>,
    });
    const { data, fetchNextPage, isFetching } = usePlayerRivals(playerUid, filters, sort);

    return (
        <>
            <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
                <Table
                    caption={
                        <>
                            <h2 className="mb-1 text-xl md:mb-4">Soupeři</h2>
                            <PlayerRivalsFilter filters={filters} setFilters={setFilters} isFetching={isFetching} />
                        </>
                    }
                    heading={RivalRow.Heading}
                    data={data ?? []}
                    onSort={Object.fromEntries(
                        (["rival.name", "rival.elo", "rival.ranking"] as Array<Sort<RivalMatchesSummary>["key"]>).map(
                            (x) => [x, (mode: SortMode | null) => setSort(mode ? { key: x, mode } : undefined)],
                        ),
                    )}
                    onRowClick={(r) =>
                        navigate({
                            to: "/player/$playerUid/vs/$rivalUid",
                            params: { playerUid, rivalUid: r.rivalUid },
                        })
                    }
                    onLoadMore={fetchNextPage}
                    isPending={isFetching}>
                    {(r, i) => <RivalRow.FC rivalMS={r} playerUid={playerUid} i={i} />}
                </Table>
            </Card>
        </>
    );
};
