import { useEffect, useRef } from 'react';

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

    const lastElementRef = (node: HTMLDivElement | null) => {
        observerRef.current?.disconnect();

        if (!node || !hasMore || isLoading) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                root,
                rootMargin: `0px 0px ${threshold}px 0px`,
                threshold: 0,
            }
        );

        observerRef.current.observe(node);
    };

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    return { lastElementRef };
}
