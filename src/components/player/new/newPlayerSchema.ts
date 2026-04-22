import * as yup from "yup";

import { Location } from "../../../api/model";
import { trimToUndefined } from "../../../lib/empty";
import { transformEmptyToUndefined } from "../../form/transform";

export const newPlayerFormSchema = yup.object({
    uid: yup.string().transform(trimToUndefined).transform(transformEmptyToUndefined).required(),
    location: yup.string().transform(transformEmptyToUndefined).oneOf(Object.values(Location)),
});

export type NewPlayerFormType = yup.InferType<typeof newPlayerFormSchema>;
