import { twMerge } from "tailwind-merge";

import { useGetBetsSummary } from "../../api/api";
import { Location } from "../../api/model";
import { RenderItem } from "../lib/RenderItem";
import { ScoreItem } from "../lib/ScoreItem";
import { Skeleton } from "../lib/Skeleton";
import { Card } from "../ui/Card";

interface Props {
    location?: Location;
    className?: string;
}

export const BetSummaryCard = ({ location, className }: Props) => {
    const { data: summary } = useGetBetsSummary({ location });

    if (!summary) return <Skeleton.Card className={twMerge("max-w-md", className)} />;

    return (
        <Card className={twMerge("max-w-md", className)}>
            <dl className="flex flex-col gap-2 md:gap-4">
                <RenderItem title={<h2>Souhrn sázek</h2>}>
                    <ScoreItem win>{summary.betsWon}</ScoreItem>
                    <span className="mx-2">:</span>
                    <ScoreItem lose>{summary.betsLost}</ScoreItem>
                    <span className="mx-2">:</span>
                    <ScoreItem>{summary.betsUnresolved}</ScoreItem>
                </RenderItem>
            </dl>
        </Card>
    );
};
