import { useGetPlayerMatches } from "../../api/api";
import { Skeleton } from "../lib/Skeleton";
import { Card } from "../ui/Card";

interface Props {
    playerUid: string;
}

export const MatchHistory = ({ playerUid }: Props) => {
    const { data } = useGetPlayerMatches(playerUid);

    return (
        <>
            <h2 className="mb-4">Historie zápasů</h2>
            <div>
                {data ? (
                    data.map((match) => (
                        <Card key={match.objectId} className="grid grid-cols-3 text-center">
                            <span>{match.playerUids.at(0)}</span>
                            <span>{match.sets?.join(":")}</span>
                            <span>{match.playerUids.at(1)}</span>
                        </Card>
                    ))
                ) : (
                    <Skeleton.Card />
                )}
            </div>
        </>
    );
};
