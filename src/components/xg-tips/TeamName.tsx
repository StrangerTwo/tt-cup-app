import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { TipTeam } from "../../api/model";

interface Props {
    team: TipTeam;
    className?: string;
}

export const TeamName: FC<Props> = ({ team, className }) => {
    return (
        <div className={twMerge("flex w-0 flex-1 grow items-center justify-end gap-2", className)}>
            <span className="w-0 max-w-max grow truncate">{team.name}</span>
            <div className="inline-block size-5 shrink-0">
                <img className="rounded-lg bg-white" src={team.logo} />
            </div>
        </div>
    );
};
