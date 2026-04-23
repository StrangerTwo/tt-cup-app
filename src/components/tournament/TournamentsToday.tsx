import { PlaceTournamentMatches } from "../../api/model";
import { renderCzIsoDate, renderFullDateShort, renderHoursShort } from "../../lib/date";
import { LinkIcon } from "../icons";
import { SortMode } from "../icons/SortIcon";
import { Skeleton } from "../lib/Skeleton";
import Table, { Sort } from "../lib/Table";
import { useLoadMoreSentinel } from "../lib/useLoadMoreSentinel";
import { useUrlSyncedTableState } from "../lib/useUrlSyncedTableState";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { TournamentRow } from "./TournamentRow";
import { useTournamentsToday } from "./useTournamentsToday";

export const TournamentsToday = () => {
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState({
        tableId: "tournamentsToday",
        defaultSorting: {
            key: "place.location",
            mode: SortMode.DESC,
        } as Sort<PlaceTournamentMatches>,
    });
    const { data, isFetching, fetchNextPage } = useTournamentsToday(filters, sort);

    const { sentinelRef } = useLoadMoreSentinel<HTMLDivElement>(data, fetchNextPage, isFetching);

    if (!data) return <Skeleton.Card />;

    return (
        <>
            <div className="flex flex-col gap-2 md:gap-4">
                {data.map(({ place, tournament, matches }) => (
                    <Card key={place.uid} className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
                        <Table
                            caption={
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl">
                                        {place.uid} | {renderFullDateShort(new Date())}{" "}
                                        {matches.at(0) && renderHoursShort(matches.at(0)!.time)} -{" "}
                                        {matches.at(-1) && renderHoursShort(matches.at(-1)!.time)}
                                    </h2>
                                    <a href={`https://ttcup.com/schedule/${renderCzIsoDate(new Date())}/${place.uid}/`}>
                                        <IconButton>
                                            <LinkIcon />
                                        </IconButton>
                                    </a>
                                </div>
                            }
                            heading={TournamentRow.Heading}
                            data={matches ?? []}
                            keyFn={(m) => m.time}
                            onLoadMore={fetchNextPage}
                            isPending={isFetching}>
                            {(m, i) => <TournamentRow.FC match={m} i={i} />}
                        </Table>
                    </Card>
                ))}
            </div>

            <div ref={sentinelRef} />
        </>
    );
};
