import * as yup from "yup";

import { trimToUndefined } from "../../../lib/empty";
import { transformEmptyToUndefined } from "../../form/transform";

export const placeRecommendationsFilterSchema = yup.object({
    search: yup.string().transform(trimToUndefined).transform(transformEmptyToUndefined),
});

export type PlaceRecommendationsFilterType = yup.InferType<typeof placeRecommendationsFilterSchema>;
