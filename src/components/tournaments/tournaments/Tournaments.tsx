import { TournamentFull } from "../../../api/model";
import { Skeleton } from "../../lib/Skeleton";
import { Sort } from "../../lib/Table";
import { useLoadMoreSentinel } from "../../lib/useLoadMoreSentinel";
import { TournamentCard } from "../TournamentCard";
import { TournamentsFilterType } from "./tournamentsFilterSchema";
import { useTournaments } from "./useTournaments";

interface Props {
    filters: TournamentsFilterType;
    sort?: Array<Sort<TournamentFull>>;
}

export const Tournaments = ({ filters, sort }: Props) => {
    const { data, isFetching, fetchNextPage } = useTournaments({ ...filters, done: true }, sort);

    const { sentinelRef } = useLoadMoreSentinel<HTMLDivElement>(data, fetchNextPage, isFetching);

    if (!data) return <Skeleton.Card />;

    return (
        <>
            <div className="mb-32 flex flex-col gap-2 md:gap-4">
                {data.map(({ place, tournament, matches }) => (
                    <TournamentCard key={tournament._id} tournamentId={tournament?._id} />
                ))}
                {isFetching && <Skeleton.Card />}
            </div>

            <div ref={sentinelRef} />
        </>
    );
};
