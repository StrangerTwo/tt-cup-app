import { useGetPlayers } from "../../api/api";
import { Skeleton } from "../lib/Skeleton";
import { Card } from "../ui/Card";
import { NewPlayer } from "./NewPlayer";

export const Players = () => {
    const { data } = useGetPlayers();

    return (
        <div className="flex flex-col gap-4">
            <NewPlayer />
            {data ? (
                <>
                    {data.map((player) => (
                        <Card>
                            <h3>
                                {player.name} ({player.uid})
                            </h3>
                            <p className="text-xs italic">elo: {player.elo}</p>
                        </Card>
                    ))}
                </>
            ) : (
                <Skeleton.Card />
            )}
        </div>
    );
};
