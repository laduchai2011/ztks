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
    RETURN QUERY
    SELECT
        COALESCE(
            (
                SELECT jsonb_agg(
                    to_jsonb(rp)
                    ORDER BY rp.id DESC
                )
                FROM (
                    SELECT *
                    FROM register_post
                    WHERE account_id = p_account_id
                      AND (
                          p_is_delete IS NULL
                          OR is_delete = p_is_delete
                      )
                    ORDER BY id DESC
                    LIMIT p_size
                    OFFSET (p_page - 1) * p_size
                ) rp
            ),
            '[]'::JSONB
        ) AS items,

        (
            SELECT COUNT(*)::BIGINT
            FROM register_post
            WHERE account_id = p_account_id
              AND (
                  p_is_delete IS NULL
                  OR is_delete = p_is_delete
              )
        ) AS total_count;
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
    RETURN QUERY
    SELECT
        COALESCE(
            (
                SELECT jsonb_agg(
                    to_jsonb(p)
                    ORDER BY p.index DESC
                )
                FROM (
                    SELECT *
                    FROM post
                    WHERE register_post_id = p_register_post_id
                      AND (
                          p_is_active IS NULL
                          OR is_active = p_is_active
                      )
                    ORDER BY index DESC
                    LIMIT p_size
                    OFFSET (p_page - 1) * p_size
                ) p
            ),
            '[]'::JSONB
        ) AS items,

        (
            SELECT COUNT(*)::BIGINT
            FROM post
            WHERE register_post_id = p_register_post_id
              AND (
                  p_is_active IS NULL
                  OR is_active = p_is_active
              )
        ) AS total_count;
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