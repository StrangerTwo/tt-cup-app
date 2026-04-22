import * as yup from "yup";

import { trimToUndefined } from "../../../lib/empty";
import { transformEmptyToUndefined } from "../../form/transform";

export const playerRivalsFilterSchema = yup.object({
    search: yup.string().transform(trimToUndefined).transform(transformEmptyToUndefined),
});

export type PlayerRivalsFilterFormType = yup.InferType<typeof playerRivalsFilterSchema>;
