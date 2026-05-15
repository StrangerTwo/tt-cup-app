import { createFileRoute } from "@tanstack/react-router";

import { useCrawl } from "../../components/crawl/useCrawl";
import { SubmitButton } from "../../components/lib/SubmitButton";
import { Tabs } from "../../components/lib/Tabs";
import { Card } from "../../components/ui/Card";
import { isDefined } from "../../lib/utils";
import { updateTabs } from ".";

export const Route = createFileRoute("/update/crawl")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data, error, going, onCrawlPageClick, onGoRecursiveBtnClick } = useCrawl();

    return (
        <>
            <Tabs tabs={updateTabs} value={"crawl"} />
            <h1 className="mb-2 text-xl md:mb-4">Stránky ke stáhnutí</h1>
            <p>Celkem: {data?.pageInfo.totalElements}</p>
            <p className="text-sm text-red-600 dark:text-red-500">{isDefined(error) ? error : null}</p>

            <SubmitButton
                loading={going}
                className="mt-2 md:mt-4"
                onClick={() => {
                    onGoRecursiveBtnClick();
                }}
                type="button">
                Go recursive
            </SubmitButton>

            <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
                {data?.results.map((crawlPage) => (
                    <Card
                        key={crawlPage.url}
                        className="flex max-w-lg justify-between"
                        hoverEffects
                        onClick={() => {
                            onCrawlPageClick(crawlPage);
                        }}>
                        <span className="text-sm">{crawlPage.url}</span>
                    </Card>
                ))}
            </div>
        </>
    );
}
