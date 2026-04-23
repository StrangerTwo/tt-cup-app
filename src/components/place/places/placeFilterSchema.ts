import * as yup from "yup";

import { Location } from "../../../api/model";
import { trimToUndefined } from "../../../lib/empty";
import { transformEmptyToUndefined } from "../../form/transform";

export const placeFilterSchema = yup.object({
    search: yup.string().transform(trimToUndefined).transform(transformEmptyToUndefined),
    location: yup.string().transform(transformEmptyToUndefined).oneOf(Object.values(Location)),
});

export type PlaceFilterFormType = yup.InferType<typeof placeFilterSchema>;
