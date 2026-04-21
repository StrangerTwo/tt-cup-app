import { useNavigate } from "@tanstack/react-router";

import { Player } from "../../api/model";
import { SortMode } from "../icons/SortIcon";
import Table, { Sort } from "../lib/Table";
import { useUrlSyncedTableState } from "../lib/useUrlSyncedTableState";
import { Card } from "../ui/Card";
import { RivalRow } from "./RivalRow";
import { usePlayerRivalsList } from "./usePlayerRivalsList";

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
        } as Sort<any>,
    });
    const { data, fetchNextPage, isFetching } = usePlayerRivalsList(playerUid, filters, sort);

    return (
        <>
            <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
                <Table
                    caption={
                        <>
                            <h2 className="text-xl">Soupeři</h2>
                        </>
                    }
                    heading={RivalRow.Heading}
                    data={data ?? []}
                    keyFn={(r) => r.rivalUid}
                    onSort={Object.fromEntries(
                        (["rival.name", "rival.elo", "rival.ranking"] as Array<any>).map((x) => [
                            x,
                            (mode: SortMode | null) => setSort(mode ? { key: x, mode } : undefined),
                        ]),
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
