import * as yup from "yup";

import { Location } from "../../api/model";
import { trimToUndefined } from "../../lib/empty";
import { transformEmptyToUndefined } from "../form/transform";

export const editPlayerSchema = yup.object({
    location: yup.string().transform(transformEmptyToUndefined).oneOf(Object.values(Location)),
    note: yup.string().transform(trimToUndefined).transform(transformEmptyToUndefined),
    stisId: yup.string().transform(trimToUndefined).transform(transformEmptyToUndefined),
});

export type EditPlayerFormType = yup.InferType<typeof editPlayerSchema>;
