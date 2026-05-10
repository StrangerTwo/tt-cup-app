import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { getGetPagesToCrawlQueryKey, useGetPagesToCrawl } from "../../api/api";
import { CrawlPage, PaginatedQueryResultCrawlPage } from "../../api/model";
import { SubmitButton } from "../../components/lib/SubmitButton";
import { Tabs } from "../../components/lib/Tabs";
import { Card } from "../../components/ui/Card";
import { updateTabs } from ".";

export const Route = createFileRoute("/update/crawl")({
    component: RouteComponent,
});

function RouteComponent() {
    const client = useQueryClient();
    const { data, refetch } = useGetPagesToCrawl();
    const [going, setGoing] = useState(false);
    const goingRef = useRef<NodeJS.Timeout | number>(null);

    const visit = useCallback(
        (page: CrawlPage) => {
            window.open(page.url, "myPage");
            client.setQueryData(
                getGetPagesToCrawlQueryKey(),
                (x: PaginatedQueryResultCrawlPage): PaginatedQueryResultCrawlPage => ({
                    results: x.results.filter((p) => p.url !== page.url),
                    pageInfo: {
                        ...x.pageInfo,
                        totalElements: x.pageInfo.totalElements - 1,
                    },
                }),
            );
        },
        [client],
    );

    const go = useCallback(() => {
        const res = client.getQueryData<PaginatedQueryResultCrawlPage>(getGetPagesToCrawlQueryKey());
        const page = res?.results.at(0);
        if (!page) {
            setGoing(false);
            return;
        }
        visit(page);
        if (!res) return;
        if (res.results.length <= 5 && res.pageInfo.totalElements > 5) {
            refetch();
        }
    }, [client, refetch, visit]);

    const goRecursive = useCallback(() => {
        goingRef.current = setTimeout(
            () => {
                go();
                goRecursive();
            },
            12_000 + Math.random() * 12_000,
        );
    }, [go]);

    useEffect(() => {
        if (goingRef.current) {
            clearTimeout(goingRef.current);
            goingRef.current = null;
        }
        if (going) {
            go();
            goRecursive();
        }
        return () => {
            if (goingRef.current) {
                clearTimeout(goingRef.current);
                goingRef.current = null;
            }
        };
    }, [go, goRecursive, going]);

    return (
        <>
            <Tabs tabs={updateTabs} value={"crawl"} />
            <h1 className="mb-2 text-xl md:mb-4">Stránky ke stáhnutí</h1>
            <span>Celkem: {data?.pageInfo.totalElements}</span>

            <SubmitButton loading={going} className="mt-2 md:mt-4" onClick={() => setGoing((x) => !x)} type="button">
                Go recursive
            </SubmitButton>

            <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
                {data?.results.map((crawlPage) => (
                    <Card
                        key={crawlPage.url}
                        className="flex max-w-lg justify-between"
                        hoverEffects
                        onClick={() => visit(crawlPage)}>
                        <span className="text-sm">{crawlPage.url}</span>
                    </Card>
                ))}
            </div>
        </>
    );
}
