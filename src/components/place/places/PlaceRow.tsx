import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import toast from "react-hot-toast";

import { getGetPlaceQueryKey, useGetPlace, useSetPlaceEnabled } from "../../../api/api";
import { Place } from "../../../api/model";
import { renderFullDateShortWithHoursShort } from "../../../lib/date";
import { resolveErrorMessage } from "../../../lib/toastError";
import { Toggle } from "../../form/Toggle";
import { Skeleton } from "../../lib/Skeleton";
import { TableProps } from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { PlayerLocation } from "../../player/PlayerLocation";

interface PlaceRowProps {
    placeUid: Place["uid"];
    i: number;
}

export const PlaceRow: {
    Heading: TableProps<Place>["heading"];
    FC: FC<PlaceRowProps>;
} = {
    Heading: [
        { label: "Uid", key: "uid" },
        { label: "Lokace", key: "location" },
        { label: "Aktualizováno", key: "lastUpdate" },
        { label: "Zapnuto", key: "disabled" },
    ],
    FC: ({ placeUid, i }) => {
        const client = useQueryClient();
        const { data: place } = useGetPlace(placeUid);
        const { mutateAsync } = useSetPlaceEnabled();

        if (!place)
            return (
                <TableCell colSpan={PlaceRow.Heading?.length || 42}>
                    <Skeleton.Text className="m-4" />
                </TableCell>
            );

        const toggleDisabled = () => {
            toast.promise(
                mutateAsync({
                    placeUid,
                    data: { status: !!place.disabled },
                }).then(() => {
                    client.setQueryData(
                        getGetPlaceQueryKey(placeUid),
                        (p: Place | undefined): Place => ({
                            ...p,
                            uid: place.uid,
                            lastUpdate: place.lastUpdate,
                            disabled: !place.disabled,
                        }),
                    );
                }),
                {
                    loading: "Ukládám...",
                    success: "Uloženo",
                    error: resolveErrorMessage,
                },
            );
        };

        return (
            <>
                <TableCell>
                    <PlayerLocation location={place.location} />
                    <span className="ms-1 align-middle">{i + 1}.</span>
                </TableCell>
                <TableCell>{place.uid}</TableCell>
                <TableCell>{renderFullDateShortWithHoursShort(place.lastUpdate)}</TableCell>
                <TableCell>
                    <Toggle name={`enabled-${place.uid}`} checked={!place.disabled} onChange={toggleDisabled} />
                </TableCell>
            </>
        );
    },
};
