import { useCallback, useState } from 'react';

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

    const loadMore = useCallback(
        async (reset = false) => {
            if (isLoading || (!hasMore && !reset)) return;

            setIsLoading(true);

            try {
                const response = await fetchData(reset ? null : nextCursor);

                setItems((prev) => (reset ? response.items : [...prev, ...response.items]));

                setNextCursor(response.next_cursor);
                setHasMore(response.next_cursor !== null);
            } catch (error) {
                console.error('Load more error:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchData, nextCursor, hasMore, isLoading]
    );

    const refresh = useCallback(() => {
        return loadMore(true);
    }, [loadMore]);

    return {
        items,
        setItems,
        nextCursor,
        hasMore,
        isLoading,
        loadMore,
        refresh,
    };
}
