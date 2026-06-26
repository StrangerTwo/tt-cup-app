import { twMerge } from "tailwind-merge";

import { useGetBehaviorForPlayer } from "../../../api/api";
import { Player, PlayerBehaviorType } from "../../../api/model";
import { isDefined } from "../../../lib/utils";
import { Score } from "../../lib/Score";
import { Skeleton } from "../../lib/Skeleton";
import Table from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { Card } from "../../ui/Card";
type Props = {
    className?: string;
    playerUid: Player["uid"];
};

export const behaviorLabels: {
    [location in PlayerBehaviorType]: string;
} = {
    [PlayerBehaviorType.ZERO_WINS]: "0 výher",
    [PlayerBehaviorType.ONE_WINS]: "1 výher",
    [PlayerBehaviorType.TWO_WINS]: "2 výher",
    [PlayerBehaviorType.THREE_WINS]: "3 výher",
};

export const TournamentBehaviorCard = ({ playerUid, className }: Props) => {
    const { data } = useGetBehaviorForPlayer(playerUid);

    if (!data) {
        return <Skeleton.Card className={className} />;
    }

    const maxColumn = Math.max(...data.behaviors.map((x) => x.items.length));

    return (
        <Card className={twMerge("w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0", className)}>
            <Table
                caption={<h2 className="text-lg">Statistika hráče v turnajích</h2>}
                heading={[
                    {
                        label: "#",
                    },
                    ...[...new Array(maxColumn).keys()].map((i) => ({
                        label: `${i + 1}.`,
                    })),
                ]}
                data={data.behaviors}>
                {(x) => (
                    <>
                        <TableCell>{behaviorLabels[x.type]}</TableCell>
                        {x.items.map((item) => (
                            <>
                                {isDefined(item.winRate) ? (
                                    <TableCell>
                                        <span className="me-2">{(item.winRate * 100).toFixed(1)}%</span>
                                        <Score scoreA={item.wins} scoreB={item.losses} isWinForA />
                                    </TableCell>
                                ) : (
                                    <TableCell>-</TableCell>
                                )}
                            </>
                        ))}
                    </>
                )}
            </Table>
        </Card>
    );
};

const x = "behavior";
