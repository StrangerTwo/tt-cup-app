import { FC } from "react";
import { CheckmarkIcon } from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import { Location, Match, Tournament, TournamentMatches } from "../../../api/model";
import { renderFullDateShort, renderHoursShort } from "../../../lib/date";
import { BoxSelect } from "../../form/BoxSelect";
import { ChevronIcon } from "../../icons";
import { CheckCircleIcon } from "../../icons/CheckCircleIcon";
import { Skeleton } from "../../lib/Skeleton";
import Table, { TableProps } from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { locationLabels, PlayerLocation } from "../../player/PlayerLocation";
import { usePlayers } from "../../player/players/usePlayers";
import { Card } from "../../ui/Card";
import { IconButton } from "../../ui/IconButton";
import { useColorLayer } from "../../ui/layout";
import { useCreatePlaceByTournamentForm } from "./useCreatePlaceByTournamentForm";

interface PlaceRecommendationRowProps {
    tournament: Tournament;
    matches: Array<Match>;
    selected: boolean;
}

interface PlaceRecommendationExpandRowProps {
    tournament: TournamentMatches;
}

export const PlaceRecommendationRow: {
    Heading: TableProps<TournamentMatches>["heading"];
    FC: FC<PlaceRecommendationRowProps>;
    ExpandRowFC: FC<PlaceRecommendationExpandRowProps>;
} = {
    Heading: [
        { label: "Hala", key: "tournament.place" },
        { label: "Poslední turnaj", key: "tournament.date" },
        { label: "Přidat", className: "text-end" },
    ],
    FC: ({ tournament, matches, selected }) => {
        const { textHighlightColor } = useColorLayer();

        if (!tournament)
            return (
                <TableCell colSpan={PlaceRecommendationRow.Heading?.length || 42}>
                    <Skeleton.Text className="m-4" />
                </TableCell>
            );

        return (
            <>
                <TableCell className={twMerge("font-medium", textHighlightColor)}>{tournament.place}</TableCell>
                <TableCell>
                    <span className="me-2 align-middle">
                        {renderFullDateShort(tournament.date)} | {renderHoursShort(matches.at(0)!.time)} -{" "}
                        {renderHoursShort(matches.at(-1)!.time)}
                    </span>
                </TableCell>
                <TableCell className="text-end">
                    <IconButton className="size-8" border>
                        <ChevronIcon direction={selected ? "up" : "down"} />
                    </IconButton>
                </TableCell>
            </>
        );
    },
    ExpandRowFC: ({ tournament: { tournament, matches } }) => {
        const { form, placeCreated, createPlace } = useCreatePlaceByTournamentForm(tournament);
        const { handleSubmit } = form;
        const { data: players, isFetching } = usePlayers({
            uids: [...new Set(matches.flatMap((m) => m.playerUids))],
        });

        return (
            <>
                <Card
                    className="mb-2 w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:mb-4 md:p-0"
                    layerStep={-1}>
                    <Table
                        caption={
                            <>
                                <h2>Hráči turnaje</h2>
                            </>
                        }
                        heading={[
                            { label: "Jméno hráče", key: "name" },
                            { label: "Lokace", key: "location" },
                        ]}
                        data={players ?? []}
                        isPending={isFetching}>
                        {(p) => (
                            <>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>
                                    <PlayerLocation location={p.location} />
                                </TableCell>
                            </>
                        )}
                    </Table>
                </Card>
                <form onSubmit={handleSubmit(createPlace)} className="flex items-end justify-between gap-2 md:gap-4">
                    <BoxSelect
                        form={form}
                        label="Lokace"
                        name="location"
                        options={Object.values(Location).map((value) => ({ label: locationLabels[value], value }))}
                    />

                    <IconButton
                        type="submit"
                        className="size-8 border-blue-700 bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {placeCreated ? <CheckmarkIcon className="size-5" /> : <CheckCircleIcon />}
                    </IconButton>
                </form>
            </>
        );
    },
};
