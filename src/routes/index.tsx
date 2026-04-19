import { createFileRoute, redirect } from "@tanstack/react-router";
import { FC } from "react";

const Index: FC = ({}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl">Tipy na sázení</h1>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/")({
    loader: () =>
        redirect({
            to: "/player",
            replace: true,
        }),
});

export default Index;
