import { useNavigate } from "@tanstack/react-router";

import { useGetPlayerRivals } from "../../api/api";
import { Player } from "../../api/model";
import Table from "../lib/Table";
import { Card } from "../ui/Card";
import { RivalRow } from "./RivalRow";

interface Props {
    playerUid: Player["uid"];
}

export const PlayerRivals = ({ playerUid }: Props) => {
    const navigate = useNavigate();
    const { data, isFetching } = useGetPlayerRivals(playerUid);

    return (
        <>
            <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
                <Table
                    caption={
                        <>
                            <h2 className="text-xl">Soupeři</h2>
                        </>
                    }
                    heading={RivalRow.Heading}
                    data={data ?? []}
                    keyFn={(r) => r.rivalUid}
                    onRowClick={(r) =>
                        navigate({ to: "/player/$playerUid/vs/$rivalUid", params: { playerUid, rivalUid: r.rivalUid } })
                    }
                    isPending={isFetching}>
                    {(rivalMS, i) => <RivalRow.FC rivalMS={rivalMS} playerUid={playerUid} />}
                </Table>
            </Card>
        </>
    );
};
