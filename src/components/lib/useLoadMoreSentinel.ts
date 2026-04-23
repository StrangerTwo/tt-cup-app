import { useEffect, useRef } from "react";

export const useLoadMoreSentinel = <E extends HTMLElement>(
    data: Array<unknown> | undefined,
    onLoadMore: (() => unknown) | undefined,
    isPending: boolean | undefined,
) => {
    const sentinelRef = useRef<E>(null);
    const sentinelIdRef = useRef<number>(data?.length);

    const hash = JSON.stringify(data);
    useEffect(() => {
        if (!onLoadMore) return;
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isPending) {
                    onLoadMore();
                    sentinelIdRef.current = data?.length;
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hash, data?.length, onLoadMore]);

    return { sentinelRef };
};
