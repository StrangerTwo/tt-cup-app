import * as yup from "yup";

import { Location } from "../../api/model";
import { transformEmptyToUndefined } from "../form/transform";

export const createPlaceByTournamentSchema = yup.object({
    location: yup.string().transform(transformEmptyToUndefined).oneOf(Object.values(Location)).required(),
});

export type CreatePlaceByTournamentType = yup.InferType<typeof createPlaceByTournamentSchema>;
