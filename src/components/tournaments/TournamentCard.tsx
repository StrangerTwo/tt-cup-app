import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { Place, Tournament } from "../../api/model";
import { renderCzIsoDate, renderFullDateShort, renderHoursShort } from "../../lib/date";
import { isDefined } from "../../lib/utils";
import { LinkIcon } from "../icons";
import { Skeleton } from "../lib/Skeleton";
import Table from "../lib/Table";
import { PlayerLocation } from "../player/PlayerLocation";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { TournamentRow } from "./today/TournamentRow";
import { useQueryTournament } from "./useQueryTournament";
import { useTournament } from "./useTournament";

type Props =
    | {
          tournamentId: Tournament["_id"];
          place?: never;
          date?: never;
      }
    | {
          place: Place;
          date: string;
          tournamentId?: Tournament["_id"];
      };

export const TournamentCard = ({ tournamentId, place: _place, date: _date }: Props) => {
    const { data } = useTournament(tournamentId);
    const place = _place ?? data?.place;
    const { isFetching, refetch } = useQueryTournament(
        { date: new Date().toISOString().slice(0, 10), place: place?.uid },
        false,
    );
    const [doRefetch, setDoRefetch] = useState(false);

    const triggerRefetch = useCallback(() => {
        if (doRefetch) {
            refetch();
            setDoRefetch(false);
        }
    }, [doRefetch, refetch]);

    useEffect(() => {
        window.addEventListener("focus", triggerRefetch);
        return () => window.removeEventListener("focus", triggerRefetch);
    }, [triggerRefetch]);

    if (!place) return <Skeleton.Card />;
    const { tournament, matches, bets } = data || {};
    const date = _date ?? tournament?.date;

    const refreshTournament = () => {
        setDoRefetch(true);
    };

    return (
        <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
            <Table
                caption={
                    <>
                        <div className="flex items-center gap-4">
                            <PlayerLocation location={place.location} className="text-xl" />
                            <div className="flex flex-col">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg">
                                        <span>
                                            {place.name} | {isDefined(date) && renderFullDateShort(date)}
                                        </span>

                                        {matches && (
                                            <span className="text-sm font-semibold">
                                                {matches.at(0) && renderHoursShort(matches.at(0)!.time)} -{" "}
                                                {matches.at(-1) && renderHoursShort(matches.at(-1)!.time)}
                                            </span>
                                        )}
                                    </h2>
                                </div>
                                <div className="flex gap-2 text-xs italic">
                                    <span>{place.uid}</span>
                                    {tournament?._id && (
                                        <Link
                                            to="/tournament/$tournamentId"
                                            params={{ tournamentId: tournament?._id }}
                                            className="underline">
                                            {tournament?._id}
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {date && (
                                <a
                                    onAuxClick={refreshTournament}
                                    onClick={refreshTournament}
                                    href={`https://ttcup.com/schedule/${renderCzIsoDate(date)}/${place.uid}/`}
                                    target="_blank">
                                    <IconButton>
                                        <LinkIcon />
                                    </IconButton>
                                </a>
                            )}
                        </div>
                    </>
                }
                heading={TournamentRow.Heading}
                data={isFetching ? [] : (matches ?? [])}
                isPending={isFetching}>
                {(m, i) => tournamentId && <TournamentRow.FC match={m} tournamentId={tournamentId} i={i} />}
            </Table>
        </Card>
    );
};
