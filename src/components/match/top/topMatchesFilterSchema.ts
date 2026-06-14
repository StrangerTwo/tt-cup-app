import * as yup from "yup";

import { MatchFilter, MatchFilterType } from "../../../api/model";
import { transformEmptyToUndefined, transformNaNToUndefined } from "../../form/transform";

const simpleMatchFilterSchema = yup.object({
    enabled: yup.boolean(),
});
const numberValueMatchFilterSchema = yup.object({
    enabled: yup.boolean(),
    value: yup
        .number()
        .transform(transformEmptyToUndefined)
        .transform(transformNaNToUndefined)
        .required()
        .when("enabled", {
            is: true,
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export const topMatchesFilterSchema = yup.object({
    done: yup.boolean().default(false),

    [MatchFilterType.STAR_PLAYER]: simpleMatchFilterSchema,
    [MatchFilterType.ELO_DIFFERENCE]: numberValueMatchFilterSchema,
    [MatchFilterType.RANK_DIFFERENCE]: numberValueMatchFilterSchema,
    [MatchFilterType.BILANCE]: numberValueMatchFilterSchema,
    [MatchFilterType.LAST_MATCH_STRONG_LOST]: simpleMatchFilterSchema,
});

export type TopMatchesFilterType = yup.InferType<typeof topMatchesFilterSchema>;

export const topMatchesFilterDefaultValues = Object.fromEntries(
    Object.values(MatchFilterType).map((type) => [type, {}]),
) as TopMatchesFilterType;

const toMatchFilter = <T extends MatchFilterType>(type: T, data: TopMatchesFilterType): Array<MatchFilter> => {
    if (!data[type]?.enabled) return [];

    switch (type) {
        case MatchFilterType.STAR_PLAYER:
        case MatchFilterType.LAST_MATCH_STRONG_LOST:
            return [{ type }];
        case MatchFilterType.ELO_DIFFERENCE:
            return [{ type, value: data[MatchFilterType.ELO_DIFFERENCE].value }];
        case MatchFilterType.RANK_DIFFERENCE:
            return [{ type, value: data[MatchFilterType.RANK_DIFFERENCE].value }];
        case MatchFilterType.BILANCE:
            return [{ type, value: data[MatchFilterType.BILANCE].value }];
    }
};

export const toMatchFilters = (data: TopMatchesFilterType): Array<MatchFilter> => {
    return Object.values(MatchFilterType).flatMap((type) => toMatchFilter(type, data));
};

export const fromMatchFilters = (data: Array<MatchFilter>): TopMatchesFilterType => {
    return data.reduce((acc, x) => {
        const { type, ...rest } = x;
        return {
            ...acc,
            [type]: {
                enabled: true,
                ...rest,
            },
        };
    }, topMatchesFilterDefaultValues);
};
