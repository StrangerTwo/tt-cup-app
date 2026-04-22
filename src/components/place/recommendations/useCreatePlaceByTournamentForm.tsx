import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useCreatePlaceByTournament } from "../../../api/api";
import { EQueryKey } from "../../../api/EQueryKey";
import { Tournament } from "../../../api/model";
import { resolveErrorMessage } from "../../../lib/toastError";
import { createPlaceByTournamentSchema, CreatePlaceByTournamentType } from "./createPlaceByTournamentSchema";

export const useCreatePlaceByTournamentForm = (tournament: Tournament) => {
    const client = useQueryClient();

    const [placeCreated, setPlaceCreated] = useState(false);
    const { mutateAsync } = useCreatePlaceByTournament();
    const form = useForm({
        resolver: yupResolver(createPlaceByTournamentSchema),
    });

    const timeoutRef = useRef<NodeJS.Timeout | number>(null);

    const clearPlace = useCallback(() => {
        timeoutRef.current = null;
        client.invalidateQueries({ queryKey: [EQueryKey.getPlaceRecommendations] });
    }, [client]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                clearPlace();
            }
        };
    }, [clearPlace]);

    const createPlace = (data: CreatePlaceByTournamentType) => {
        toast.promise(
            mutateAsync({ data: { tournamentId: tournament._id, location: data.location } }).then((placeId) => {
                setPlaceCreated(true);
                timeoutRef.current = setTimeout(clearPlace, 500);
            }),
            {
                loading: "Ukládám...",
                success: "Uloženo",
                error: resolveErrorMessage,
            },
        );
    };

    return {
        createPlace,
        form,
        placeCreated,
    };
};
