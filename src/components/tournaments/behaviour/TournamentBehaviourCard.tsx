import { twMerge } from "tailwind-merge";

import { Player } from "../../../api/model";
import { Skeleton } from "../../lib/Skeleton";
import Table from "../../lib/Table";
import { TableCell } from "../../lib/TableCell";
import { Card } from "../../ui/Card";
type Props = {
    className?: string;
    playerUid: Player["uid"];
};

export const TournamentBehaviorCard = ({ playerUid, className }: Props) => {
    const summary = true;

    if (!summary) {
        return <Skeleton.Card className={className} />;
    }

    return (
        <Card className={twMerge("w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0", className)}>
            <Table
                heading={[
                    {
                        label: "#",
                    },
                    {
                        label: "1.",
                    },
                    {
                        label: "2.",
                    },
                    {
                        label: "3.",
                    },
                    {
                        label: "4.",
                    },
                    {
                        label: "5.",
                    },
                    {
                        label: "6.",
                    },
                ]}
                data={[
                    { situation: "0 výher" },
                    { situation: "1 výhra" },
                    { situation: "2 výhry" },
                    { situation: "3 výhry" },
                    { situation: "Zaručený postup" },
                ]}>
                {(x) => (
                    <>
                        <TableCell>{x.situation}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                    </>
                )}
            </Table>
        </Card>
    );
};

const x = "behavior";
