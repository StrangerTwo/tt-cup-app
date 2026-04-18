import { useGetPlayerRivals } from "../../api/api";
import { Player } from "../../api/model";
import Table from "../lib/Table";
import { Card } from "../ui/Card";
import { RivalRow } from "./RivalRow";

interface Props {
    playerUid: Player["uid"];
}

export const PlayerRivals = ({ playerUid }: Props) => {
    const { data, isFetching } = useGetPlayerRivals(playerUid, {
        query: {
            select: (x) => {
                return x.sort((a, b) => 0);
            },
        },
    });

    return (
        <>
            <Card className="w-0 min-w-full overflow-x-auto p-0 md:p-0">
                <Table
                    caption={
                        <>
                            <h2 className="text-xl">Historie zápasů</h2>
                        </>
                    }
                    heading={RivalRow.Heading}
                    data={data ?? []}
                    keyFn={(r) => r.rivalUid}
                    isPending={isFetching}>
                    {(rivalMS, i) => <RivalRow.FC rivalMS={rivalMS} playerUid={playerUid} />}
                </Table>
            </Card>
        </>
    );
};
