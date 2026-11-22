import { useCallback, useRef, useState } from 'react';

export interface CursorResponse<T> {
    items: T[];
    next_cursor: string | null;
}

interface UseLoadMoreProps<T> {
    fetchData: (cursor: string | null) => Promise<CursorResponse<T>>;
}

export function useLoadMore<T>({ fetchData }: UseLoadMoreProps<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loadingRef = useRef(false);
    const cursorRef = useRef<string | null>(null);
    const hasMoreRef = useRef(true);

    const loadMore = useCallback(
        async (reset = false) => {
            if (loadingRef.current) return;

            if (!hasMoreRef.current && !reset) return;

            loadingRef.current = true;
            setIsLoading(true);

            try {
                const cursor = reset ? null : cursorRef.current;

                const response = await fetchData(cursor);

                console.log(11111, response);

                setItems((prev) => (reset ? response.items : [...prev, ...response.items]));

                cursorRef.current = response.next_cursor;
                hasMoreRef.current = response.next_cursor !== null;

                setNextCursor(response.next_cursor);
                setHasMore(response.next_cursor !== null);
            } catch (error) {
                console.error('Load more error:', error);
            } finally {
                loadingRef.current = false;
                setIsLoading(false);
            }
        },
        [fetchData]
    );

    const refresh = useCallback(() => {
        return loadMore(true);
    }, [loadMore]);

    const clear = useCallback(() => {
        if (loadingRef.current) return;

        cursorRef.current = null;
        hasMoreRef.current = true;

        setItems([]);
        setNextCursor(null);
        setHasMore(true);
    }, []);

    return {
        items,
        setItems,
        nextCursor,
        hasMore,
        isLoading,
        loadMore,
        refresh,
        clear,
    };
}
