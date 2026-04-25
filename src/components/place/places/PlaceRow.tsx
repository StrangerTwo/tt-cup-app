import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getGetPlaceQueryKey, useEditPlace, useGetPlace, useSetPlaceEnabled } from "../../../api/api";
import { Location, Place } from "../../../api/model";
import { renderFullDateShortWithHoursShort } from "../../../lib/date";
import { resolveErrorMessage } from "../../../lib/toastError";
import { isDefined } from "../../../lib/utils";
import { BoxSelect } from "../../form/BoxSelect";
import { Toggle } from "../../form/Toggle";
import { CheckCircleIcon } from "../../icons/CheckCircleIcon";
import { Skeleton } from "../../lib/Skeleton";
import { TableProps } from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { locationLabels, PlayerLocation } from "../../player/PlayerLocation";
import { IconButton } from "../../ui/IconButton";
import { EditPlaceFormType, editPlaceSchema } from "./editPlaceSchema";

interface PlaceRowProps {
    placeUid: Place["uid"];
    i: number;
}

interface PlaceExpandRowProps {
    place: Place;
}

export const PlaceRow: {
    Heading: TableProps<Place>["heading"];
    FC: FC<PlaceRowProps>;
    ExpandRowFC: FC<PlaceExpandRowProps>;
} = {
    Heading: [
        { label: "#" },
        { label: "Jméno", key: "name" },
        { label: "Začíná v", key: "startTime" },
        { label: "Uid", key: "uid" },
        { label: "Aktualizováno", key: "lastUpdate" },
        { label: "Zapnuto", key: "enabled" },
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
                    data: { status: !place.enabled },
                }).then(() => {
                    client.setQueryData(
                        getGetPlaceQueryKey(placeUid),
                        (p: Place | undefined): Place => ({
                            ...place,
                            enabled: !place.enabled,
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
                <TableCell>{place.name}</TableCell>
                <TableCell>{place.startTime.slice(0, -3)}</TableCell>
                <TableCell>{place.uid}</TableCell>
                <TableCell>
                    {isDefined(place.lastUpdate) ? renderFullDateShortWithHoursShort(place.lastUpdate) : "-"}
                </TableCell>
                <TableCell>
                    <Toggle name={`enabled-${place.uid}`} checked={place.enabled} onChange={toggleDisabled} />
                </TableCell>
            </>
        );
    },
    ExpandRowFC: ({ place }) => {
        const client = useQueryClient();
        const { mutateAsync } = useEditPlace();
        const form = useForm({
            defaultValues: {
                location: place.location,
            },
            resolver: yupResolver(editPlaceSchema),
        });
        const { handleSubmit } = form;

        const editPlace = (data: EditPlaceFormType) => {
            toast.promise(
                mutateAsync({ placeUid: place.uid, data }).then(() => {
                    client.setQueryData(getGetPlaceQueryKey(place.uid), (): Place => ({ ...place, ...data }));
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
                <form onSubmit={handleSubmit(editPlace)} className="flex items-end justify-between gap-2 md:gap-4">
                    <BoxSelect
                        form={form}
                        label="Lokace"
                        name="location"
                        options={Object.values(Location).map((value) => ({ label: locationLabels[value], value }))}
                    />

                    <IconButton
                        type="submit"
                        className="size-8 border-blue-700 bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <CheckCircleIcon />
                    </IconButton>
                </form>
            </>
        );
    },
};
