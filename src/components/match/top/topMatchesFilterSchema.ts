import * as yup from "yup";

import { MatchFilterType } from "../../../api/model";

const simpleMatchFilterSchema = yup.object({
    enabled: yup.boolean().transform((x) => !!x || undefined),
});
const numberValueMatchFilterSchema = yup.object({
    enabled: yup.boolean().transform((x) => !!x || undefined),
    value: yup.number().required(),
});

export const topMatchesFilterSchema = yup.object({
    filters: yup
        .object({
            [MatchFilterType.STAR_PLAYER]: simpleMatchFilterSchema,
            [MatchFilterType.ELO_DIFFERENCE]: numberValueMatchFilterSchema,
            [MatchFilterType.RANK_DIFFERENCE]: numberValueMatchFilterSchema,
            [MatchFilterType.BILANCE]: numberValueMatchFilterSchema,
            [MatchFilterType.LAST_MATCH_STRONG_LOST]: simpleMatchFilterSchema,
        })
        .required(),
});

export type TopMatchesFilterType = yup.InferType<typeof topMatchesFilterSchema>;
