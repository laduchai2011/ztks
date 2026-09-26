const map = new Map<string, string>();

export function cache_Node(key: string, value: string, ttl: number) {
    map.set(key, value);

    setTimeout(() => {
        map.delete(key);
    }, ttl);
}
