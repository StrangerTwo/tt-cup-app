import { useGetOutdatedPlaces } from "../../../api/api";
import { LinkIcon } from "../../icons";
import { Skeleton } from "../../lib/Skeleton";
import { PlayerLocation } from "../../player/PlayerLocation";
import { Card } from "../../ui/Card";
import { IconButton } from "../../ui/IconButton";

export const OutdatedPlaces = () => {
    const { data } = useGetOutdatedPlaces();

    if (!data) return <Skeleton.Card />;

    return (
        <>
            <div className="flex flex-col gap-2 md:gap-4">
                {data.map(({ place, updateUrl }) => (
                    <Card key={place.uid} className="max-w-sm">
                        <h2 className="flex items-center gap-2 md:gap-4">
                            <span>{place.uid}</span>
                            <PlayerLocation location={place.location} />
                            <a href={updateUrl} target="_blank">
                                <IconButton className="size-8">
                                    <LinkIcon className="size-4" />
                                </IconButton>
                            </a>
                        </h2>
                        <p className="text-sm italic">Naposledy aktualizováno: {place.lastUpdate?.slice(0, -3)}</p>
                    </Card>
                ))}
            </div>
        </>
    );
};
