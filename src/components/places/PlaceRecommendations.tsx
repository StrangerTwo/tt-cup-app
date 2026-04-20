import { useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

import { getGetPlaceRecommendationsQueryKey } from "../../api/api";
import { RefreshIcon } from "../icons";
import Table from "../lib/Table";
import { Card } from "../ui/Card";
import { PlaceRecommendationRow } from "./PlaceRecommendationRow";
import { usePlaceRecommendations } from "./usePlaceRecommendations";

export const PlaceRecommendations = () => {
    const client = useQueryClient();
    const { data: recommendations, isFetching } = usePlaceRecommendations();

    return (
        <Card className="w-0 min-w-full overflow-x-auto overflow-y-hidden p-0 md:p-0">
            <Table
                caption={
                    <>
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl">Doporučené stoly</h1>
                            <button
                                type="submit"
                                onClick={() =>
                                    client.invalidateQueries({ queryKey: getGetPlaceRecommendationsQueryKey() })
                                }
                                className="ms-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <RefreshIcon className={twMerge(isFetching && "animate-spin")} />
                                <span className="sr-only">Search</span>
                            </button>
                        </div>
                    </>
                }
                heading={PlaceRecommendationRow.Heading}
                data={recommendations ?? []}
                keyFn={(p) => p._id}
                expandRow={(t) => <PlaceRecommendationRow.ExpandRowFC tournament={t} />}
                isPending={isFetching}>
                {(t, i, selected) => <PlaceRecommendationRow.FC tournamentId={t._id} selected={selected} />}
            </Table>
        </Card>
    );
};
