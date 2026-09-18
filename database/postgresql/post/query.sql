CREATE OR REPLACE FUNCTION get_register_post_with_id (
    p_id UUID
)
RETURNS SETOF register_post
LANGUAGE sql
AS $$
    SELECT *
    FROM register_post
    WHERE id = p_id;
$$;

CREATE OR REPLACE FUNCTION get_register_posts (
    p_page INT,
    p_size INT,
    p_account_id UUID,
	p_is_delete BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COALESCE(
            jsonb_agg(to_jsonb(rp) ORDER BY rp.id DESC),
            '[]'::JSONB
        ),
        (
            SELECT COUNT(*)
            FROM register_post AS rp_count
            WHERE
                (p_is_delete IS NULL OR rp_count.is_delete = p_is_delete)
                AND rp_count.account_id = p_account_id
        )
    INTO items, total_count
    FROM (
        SELECT rp.*
        FROM register_post AS rp
        WHERE
            (p_is_delete IS NULL OR rp.is_delete = p_is_delete)
            AND rp.account_id = p_account_id
        ORDER BY rp.id DESC
        LIMIT p_size
        OFFSET (p_page - 1) * p_size
    ) AS rp;
END;
$$;

CREATE OR REPLACE FUNCTION get_posts (
    p_page INT,
    p_size INT,
    p_register_post_id UUID,
	p_is_active BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COALESCE(
            jsonb_agg(to_jsonb(p) ORDER BY p.index DESC),
            '[]'::JSONB
        ),
        (
            SELECT COUNT(*)
            FROM post AS p_count
            WHERE
                (p_is_active IS NULL OR p_count.is_active = p_is_active)
                AND p_count.register_post_id = p_register_post_id
        )
    INTO items, total_count
    FROM (
        SELECT p.*
        FROM post AS p
        WHERE
            (p_is_active IS NULL OR p.is_active = p_is_active)
            AND p.register_post_id = p_register_post_id
        ORDER BY p.index DESC
        LIMIT p_size
        OFFSET (p_page - 1) * p_size
    ) AS p;
END;
$$;

CREATE OR REPLACE FUNCTION get_post_with_id (
    p_id UUID
)
RETURNS SETOF post
LANGUAGE sql
AS $$
    SELECT *
    FROM post
    WHERE id = p_id;
$$;