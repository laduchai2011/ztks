CREATE OR REPLACE FUNCTION create_cache_redis (
    p_key VARCHAR(255),
    p_value TEXT
)
RETURNS SETOF cache_redis
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_cache_redis_id UUID;
BEGIN
    INSERT INTO cache_redis (
        key,
        value,
        update_time,
        create_time
    )
    VALUES (
        p_key,
        p_value,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_cache_redis_id;

    IF v_new_cache_redis_id IS NULL THEN
        RAISE EXCEPTION 'Cập nhật cacheRedis không thành công.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN QUERY
    SELECT *
    FROM cache_redis
    WHERE id = v_new_cache_redis_id;
END;
$$;

-- DROP FUNCTION update_value_cache_redis(VARCHAR, TEXT);
CREATE OR REPLACE FUNCTION update_value_cache_redis (
    p_key VARCHAR(255),
    p_value TEXT
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
DECLARE
    v_cache_redis_id UUID;
BEGIN
    SELECT cr.id
    INTO v_cache_redis_id
    FROM cache_redis AS cr
    WHERE cr.key = p_key;

    IF v_cache_redis_id IS NULL THEN
        RAISE EXCEPTION 'cache_redis không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE cache_redis
    SET value = p_value
    WHERE id = v_cache_redis_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật cache_redis không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    RETURN QUERY
    SELECT
        cr.id,
        cr.key,
        cr.value,
        cr.update_time,
        cr.create_time
    FROM cache_redis AS cr
    WHERE cr.id = v_cache_redis_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_cache_redis_with_key (
    p_key VARCHAR(255)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_deleted_count INT;
BEGIN
    DELETE FROM cache_redis
    WHERE key = p_key;

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

    RETURN v_deleted_count > 0;
END;
$$;