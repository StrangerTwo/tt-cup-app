import { twMerge } from "tailwind-merge";

import { Location } from "../../api/model";
import { Card } from "../ui/Card";

interface Props {
    location: Location | undefined;
    className?: string;
}

export const locationLabels: {
    [location in Location]: string;
} = {
    [Location.HAVLICKUV_BROD]: "Brod",
    [Location.HAVIROV]: "Havířov",
    [Location.PRAHA]: "Praha",
};

export const PlayerLocation = ({ location, className }: Props) => {
    return (
        <Card
            className={twMerge(
                "inline-flex size-[1.5em] items-center justify-center p-0 align-middle md:p-0",
                className,
            )}>
            {location}
        </Card>
    );
};
