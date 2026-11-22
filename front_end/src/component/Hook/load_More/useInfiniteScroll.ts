import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
    loadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    root?: HTMLElement | null;
    threshold?: number;
}

export function useInfiniteScroll({
    loadMore,
    hasMore,
    isLoading,
    root = null,
    threshold = 200,
}: UseInfiniteScrollProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const loadMoreRef = useRef(loadMore);

    useEffect(() => {
        loadMoreRef.current = loadMore;
    }, [loadMore]);

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            observerRef.current?.disconnect();

            if (!node) return;

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];

                    if (entry?.isIntersecting) {
                        loadMoreRef.current();
                    }
                },
                {
                    root,
                    rootMargin: `0px 0px ${threshold}px 0px`,
                    threshold: 0.3,
                }
            );

            observerRef.current.observe(node);
        },
        [root, threshold]
    );

    useEffect(() => {
        if (hasMore && !isLoading) {
            // Observer sẽ được tạo lại khi node thay đổi.
            // Không cần gọi loadMore ở đây.
        }
    }, [hasMore, isLoading]);

    useEffect(() => {
        return () => observerRef.current?.disconnect();
    }, []);

    return { lastElementRef };
}
