import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { getGetPagesToCrawlQueryKey, getIsCrawlPage, useGetPagesToCrawl } from "../../api/api";
import { CrawlPage, PaginatedQueryResultCrawlPage } from "../../api/model";
import { SubmitButton } from "../../components/lib/SubmitButton";
import { Tabs } from "../../components/lib/Tabs";
import { Card } from "../../components/ui/Card";
import { sleep } from "../../lib/sleep";
import { isDefined } from "../../lib/utils";
import { updateTabs } from ".";

export const Route = createFileRoute("/update/crawl")({
    component: RouteComponent,
});

function RouteComponent() {
    const client = useQueryClient();
    const { data, refetch } = useGetPagesToCrawl();
    const [error, setError] = useState<string>();
    const [going, setGoing] = useState(false);
    const goingRef = useRef<NodeJS.Timeout | number>(null);
    const captchaSafeRef = useRef(true);

    const awaitPageVisit = useCallback(
        async (page: CrawlPage) => {
            const onVisited = () => {
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
                captchaSafeRef.current = true;
            };
            await sleep(5000);
            if ((await getIsCrawlPage(page.url)).status === false) {
                onVisited();
            } else {
                await sleep(5000);
                if ((await getIsCrawlPage(page.url)).status === false) {
                    onVisited();
                }
            }
        },
        [client],
    );

    const go = useCallback(async () => {
        const res = client.getQueryData<PaginatedQueryResultCrawlPage>(getGetPagesToCrawlQueryKey());
        if (!res) return;
        const page = res.results.at(0);
        if (!page) throw new Error("Jsme na konci");
        if (captchaSafeRef.current == false) throw new Error("Tahle stránka je CAPTCHA, vyřeš");
        captchaSafeRef.current = false;
        window.open(page.url, "myPage");
        await awaitPageVisit(page);

        if (res.results.length <= 5 && res.pageInfo.totalElements > 5) {
            refetch();
        }
    }, [client, refetch, awaitPageVisit]);

    const goRecursive = useCallback(() => {
        goingRef.current = setTimeout(
            async () => {
                try {
                    await go();
                    goRecursive();
                } catch (error_: unknown) {
                    setError(String(error_));
                    setGoing(false);
                }
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
            <p>Celkem: {data?.pageInfo.totalElements}</p>
            <p className="text-sm text-red-600 dark:text-red-500">{isDefined(error) ? error : null}</p>

            <SubmitButton
                loading={going}
                className="mt-2 md:mt-4"
                onClick={() => {
                    setError(undefined);
                    captchaSafeRef.current = true;

                    try {
                        if (!going) go();
                        setGoing((x) => !x);
                    } catch (error_: unknown) {
                        setError(String(error_));
                    }
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
                        onClick={() => awaitPageVisit(crawlPage)}>
                        <span className="text-sm">{crawlPage.url}</span>
                    </Card>
                ))}
            </div>
        </>
    );
}
