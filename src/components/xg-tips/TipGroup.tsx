import { parseISO } from "date-fns";
import { FC, useMemo } from "react";

import { XgTip } from "../../api/model";
import { FavouriteTipButton } from "./FavouriteTipButton";
import { TipRow } from "./TipRow";

interface Props {
    group: Array<XgTip>;
}

export const TipGroup: FC<Props> = ({ group }) => {
    const bestTip = useMemo(() => {
        return group.find((x) => x.tournament.country) || group[0];
    }, [group]);

    return (
        <div className="flex flex-col gap-1">
            <h2 className="flex gap-2">
                <div className="inline-block size-5 rounded-lg">
                    {bestTip.tournament.country && (
                        <img
                            src={`https://api.xgscore.io/public/img/logos/${bestTip.tournament.country.toLowerCase()}_32.png`}
                        />
                    )}
                </div>
                {bestTip.tournament.country}
                <div className="inline-block size-5">
                    <img className="rounded-lg bg-white" src={bestTip.tournament.logo} />
                </div>
                {bestTip.tournament.name}{" "}
                {parseISO(bestTip.datetime).toLocaleDateString("cs", { day: "numeric", month: "long" })}
            </h2>

            {group.map((tip) => (
                <TipRow key={tip.id} tip={tip}>
                    <FavouriteTipButton tip={tip} />
                </TipRow>
            ))}
        </div>
    );
};
