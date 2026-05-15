import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { getGetPagesToCrawlQueryKey, getIsCrawlPage, useGetPagesToCrawl } from "../../api/api";
import { CrawlPage, PaginatedQueryResultCrawlPage } from "../../api/model";
import { sleep } from "../../lib/sleep";

export const useCrawl = () => {
    const client = useQueryClient();
    const { data, refetch } = useGetPagesToCrawl({ query: { refetchInterval: 60_000 } });
    const [going, setGoing] = useState(false);
    const [error, setError] = useState<string>();
    const captchaSafeRef = useRef(true);
    const goingRef = useRef<NodeJS.Timeout | number>(null);

    const awaitPageVisit = useCallback(
        async (page: CrawlPage) => {
            const onVisited = () => {
                client.setQueryData(
                    getGetPagesToCrawlQueryKey(),
                    (x: PaginatedQueryResultCrawlPage): PaginatedQueryResultCrawlPage => {
                        if (x.pageInfo.totalElements - 1 == 0 && goingRef.current) {
                            clearTimeout(goingRef.current);
                            goingRef.current = null;
                        }
                        return {
                            results: x.results.filter((p) => p.url !== page.url),
                            pageInfo: {
                                ...x.pageInfo,
                                totalElements: x.pageInfo.totalElements - 1,
                            },
                        };
                    },
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

    const onCrawlPageClick = useCallback(
        (page: CrawlPage) => {
            window.open(page.url, "myPage");
            return awaitPageVisit(page);
        },
        [awaitPageVisit],
    );

    const go = useCallback(async () => {
        const res = client.getQueryData<PaginatedQueryResultCrawlPage>(getGetPagesToCrawlQueryKey());
        if (!res) return;
        const page = res.results.at(0);
        if (!page) throw new Error("Jsme na konci");
        if (captchaSafeRef.current == false) throw new Error("Tahle stránka je CAPTCHA, vyřeš");
        captchaSafeRef.current = false;
        await onCrawlPageClick(page);

        if (res.results.length <= 5 && res.pageInfo.totalElements > 5) {
            refetch();
        }
    }, [client, onCrawlPageClick, refetch]);

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

    const onGoRecursiveBtnClick = () => {
        setError(undefined);
        captchaSafeRef.current = true;

        try {
            if (!going) go();
            setGoing((x) => !x);
        } catch (error_: unknown) {
            setError(String(error_));
        }
    };

    return {
        data,
        error,
        going,
        onCrawlPageClick,
        onGoRecursiveBtnClick,
    };
};
