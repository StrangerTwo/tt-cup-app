import { FC, useEffect, useState } from "react";

import { XgTip } from "../../api/model";
import { Accordion } from "../ui/Accordion";

interface Props {
    setFilters: (filters: Array<(tip: XgTip) => boolean>) => void;
}

export const TipFilters: FC<Props> = ({ setFilters }) => {
    const [difference, setDifference] = useState(0.5);
    const [awayWin, setAwayWin] = useState(true);

    useEffect(() => {
        setFilters(
            [
                (tip: XgTip) => Math.abs(tip.homeTeam.forecastScore - tip.awayTeam.forecastScore) >= difference,
                awayWin ? null : (tip: XgTip) => tip.homeTeam.forecastScore > tip.awayTeam.forecastScore,
            ].filter((x) => !!x),
        );
    }, [awayWin, difference, setFilters]);

    return (
        <div>
            <Accordion title="Filtr" size="sm" isOpen>
                <label htmlFor="difference" className="block text-sm font-medium">
                    Rozdíl gólů: {difference}
                </label>
                <input
                    id="difference"
                    type="range"
                    step={0.1}
                    value={difference}
                    min={0}
                    max={1.5}
                    onInput={(e) => setDifference(Number(e.currentTarget.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-blue-600"
                />

                <div className="mt-4 flex items-center">
                    <input
                        key={Math.random()}
                        checked={awayWin}
                        id="awayWin"
                        type="checkbox"
                        value=""
                        name="bordered-checkbox"
                        className="size-4 rounded-sm border focus:ring-2 focus:ring-blue-600"
                        onChange={(e) => setAwayWin(e.currentTarget.checked)}
                    />

                    <label
                        htmlFor="awayWin"
                        className="ms-2 select-none text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}>
                        Výhra hostů
                    </label>
                </div>
            </Accordion>
        </div>
    );
};
