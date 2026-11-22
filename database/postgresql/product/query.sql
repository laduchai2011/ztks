CREATE OR REPLACE FUNCTION get_product_code_by_id (
    p_id UUID
)
RETURNS SETOF product_code
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT pc.*
    FROM product_code pc
    WHERE pc.id = p_id
      AND pc.is_delete = FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION get_product_by_id (
    p_id UUID
)
RETURNS SETOF product
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT pc.*
    FROM product p
    WHERE pc.id = p_id
      AND pc.is_delete = FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION get_product_code_total (
    p_admin_account_id UUID
)
RETURNS SETOF product_code_total
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT pct.*
    FROM product_code_total pct
    WHERE pct.admin_account_id = p_admin_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_product_total (
    p_admin_account_id UUID
)
RETURNS SETOF product_total
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT pt.*
    FROM product_total pt
    WHERE pt.admin_account_id = p_admin_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_random_products (
    p_account_id UUID,
    p_seed UUID,
    p_limit INTEGER DEFAULT 20,
    p_cursor TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_last_random_key TEXT;
    v_last_id UUID;

    v_items JSONB;
    v_has_more BOOLEAN;
    v_next_cursor TEXT;
BEGIN
    IF p_account_id IS NULL THEN
        RAISE EXCEPTION 'Account ID cannot be NULL';
    END IF;

    IF p_seed IS NULL THEN
        RAISE EXCEPTION 'Seed cannot be NULL';
    END IF;

    p_limit := LEAST(
        GREATEST(COALESCE(p_limit, 20), 1),
        100
    );

    -- Giải mã cursor
    IF p_cursor IS NOT NULL AND p_cursor <> '' THEN
        v_last_random_key := p_cursor::JSONB ->> 'last_random_key';
        v_last_id := (p_cursor::JSONB ->> 'last_id')::UUID;
    END IF;

    WITH products AS (
        SELECT
            p.*,
            md5(p_seed::TEXT || p.id::TEXT) AS random_key
        FROM product p
        WHERE
            p.account_id = p_account_id
            AND p.is_delete = FALSE
    ),
    filtered AS (
        SELECT *
        FROM products
        WHERE
            v_last_random_key IS NULL
            OR (random_key, id) > (v_last_random_key, v_last_id)
        ORDER BY random_key, id
        LIMIT p_limit + 1
    ),
    limited AS (
        SELECT *
        FROM filtered
        ORDER BY random_key, id
        LIMIT p_limit
    )
    SELECT
        COALESCE(
            jsonb_agg(
                to_jsonb(l) - 'random_key'
                ORDER BY l.random_key, l.id
            ),
            '[]'::JSONB
        ),
        (SELECT COUNT(*) > p_limit FROM filtered)
    INTO
        v_items,
        v_has_more
    FROM limited l;

    -- Tạo cursor tiếp theo
    IF v_has_more THEN
        SELECT jsonb_build_object(
            'last_random_key', random_key,
            'last_id', id
        )::TEXT
        INTO v_next_cursor
        FROM limited
        ORDER BY random_key DESC, id DESC
        LIMIT 1;
    ELSE
        v_next_cursor := NULL;
    END IF;

    RETURN jsonb_build_object(
        'items', v_items,
        'next_cursor', v_next_cursor
    );
END;
$$;