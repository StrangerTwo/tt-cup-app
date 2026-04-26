import * as yup from "yup";

import { Location } from "../../../api/model";
import { transformEmptyToUndefined } from "../../form/transform";

export const tournamentsTodayFilterSchema = yup.object({
    location: yup.string().transform(transformEmptyToUndefined).oneOf(Object.values(Location)),
    done: yup.boolean().transform((x) => !!x || undefined),
});

export type TournamentsTodayFilterType = yup.InferType<typeof tournamentsTodayFilterSchema>;
