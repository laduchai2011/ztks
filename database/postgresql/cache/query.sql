CREATE OR REPLACE FUNCTION get_a_cache_redis_with_key(
    p_key VARCHAR(255)
)
RETURNS TABLE (
    id UUID,
    key VARCHAR(255),
    value TEXT,
    update_time TIMESTAMPTZ,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.key,
        c.value,
        c.update_time,
        c.create_time
    FROM cache_redis c
    WHERE c.key = p_key;
END;
$$;