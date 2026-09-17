CREATE OR REPLACE FUNCTION get_chat_sessions_with_account_id (
    p_page INT,
    p_size INT,
    p_zalo_oa_id UUID DEFAULT NULL,
    p_account_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
	v_items JSONB;
    v_total_count BIGINT;
BEGIN
    SELECT COUNT(*)
    INTO v_total_count
    FROM chat_session AS cs
    WHERE cs.status = 'normal'
      AND (p_zalo_oa_id IS NULL OR cs.zalo_oa_id = p_zalo_oa_id)
      AND (p_account_id IS NULL OR cs.account_id = p_account_id);

    SELECT COALESCE(
        jsonb_agg(to_jsonb(t) - 'rn'),
        '[]'::jsonb
    )
    INTO v_items
    FROM (
        SELECT
            cs.*,
            ROW_NUMBER() OVER (ORDER BY cs.id DESC) AS rn
        FROM chat_session AS cs
        WHERE cs.status = 'normal'
          AND (p_zalo_oa_id IS NULL OR cs.zalo_oa_id = p_zalo_oa_id)
          AND (p_account_id IS NULL OR cs.account_id = p_account_id)
        ORDER BY cs.id DESC
        OFFSET (p_page - 1) * p_size
        LIMIT p_size
    ) AS t;

    RETURN jsonb_build_object(
        'items', v_items,
        'total_count', v_total_count
    );
END;
$$;

CREATE OR REPLACE FUNCTION user_take_session_to_chat (
    p_code VARCHAR(255),
    p_zalo_oa_id UUID
)
RETURNS SETOF chat_session
LANGUAGE sql
AS $$
    SELECT cs.*
    FROM chat_session AS cs
    WHERE cs.status = 'normal'
      AND cs.is_ready = TRUE
      AND (p_code IS NULL OR cs.code = p_code)
      AND (p_zalo_oa_id IS NULL OR cs.zalo_oa_id = p_zalo_oa_id);
$$;