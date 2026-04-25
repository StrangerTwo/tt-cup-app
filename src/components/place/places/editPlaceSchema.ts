import * as yup from "yup";

import { Location } from "../../../api/model";
import { transformEmptyToUndefined } from "../../form/transform";

export const editPlaceSchema = yup.object({
    location: yup.string().transform(transformEmptyToUndefined).oneOf(Object.values(Location)),
});

export type EditPlaceFormType = yup.InferType<typeof editPlaceSchema>;
