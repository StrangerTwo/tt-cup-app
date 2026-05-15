import { useForm } from "react-hook-form";

import { MatchFilterType } from "../../../api/model";
import { Input } from "../../form/Input";
import { Toggle } from "../../form/Toggle";
import { useColorLayer } from "../../ui/layout";
import { TopMatchesFilterType } from "../top/topMatchesFilterSchema";

interface Props {
    type: MatchFilterType;
}

export const filterLabels: {
    [location in MatchFilterType]: string;
} = {
    [MatchFilterType.STAR_PLAYER]: "Hráč označen hvězdičkou",
    [MatchFilterType.ELO_DIFFERENCE]: "Rozdíl ELO",
    [MatchFilterType.RANK_DIFFERENCE]: "Rozdíl RANK",
    [MatchFilterType.BILANCE]: "Bilance",
    [MatchFilterType.LAST_MATCH_STRONG_LOST]: "Poslední utkání porážka lepšího hráče",
};

export const MatchFilter = ({ type }: Props) => {
    const { textColor } = useColorLayer(1);
    const form = useForm<TopMatchesFilterType>();

    return (
        <div className="flex flex-col gap-2">
            <Toggle form={form} name={`filters.${type}.enabled`} label={filterLabels[type]} className={textColor} />
            {(type === "BIL" || type === "ELO" || type === "RANK") && (
                <Input form={form} name={`filters.${type}.value`} placeholder="více než" />
            )}
        </div>
    );
};
