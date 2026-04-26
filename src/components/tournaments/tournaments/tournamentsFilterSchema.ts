import * as yup from "yup";

import { Location } from "../../../api/model";
import { transformEmptyToUndefined } from "../../form/transform";

export const tournamentsFilterSchema = yup.object({
    location: yup.string().transform(transformEmptyToUndefined).oneOf(Object.values(Location)),
});

export type TournamentsFilterType = yup.InferType<typeof tournamentsFilterSchema>;
