CREATE OR REPLACE FUNCTION get_vouchers (
    p_page INT,
    p_size INT,
    p_phone VARCHAR(255),
	p_is_used BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    data JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(
            (
                SELECT jsonb_agg(to_jsonb(v))
                FROM (
                    SELECT
                        v.*
                    FROM voucher AS v
                    WHERE
                        (p_is_used IS NULL OR v.is_used = p_is_used)
                        AND v.phone = p_phone
                    ORDER BY v.id DESC
                    OFFSET (p_page - 1) * p_size
                    LIMIT p_size
                ) AS v
            ),
            '[]'::jsonb
        ) AS data,
        (
            SELECT COUNT(*)
            FROM voucher AS v
            WHERE
                (p_is_used IS NULL OR v.is_used = p_is_used)
                AND v.phone = p_phone
        ) AS total_count;
END;
$$;

CREATE OR REPLACE FUNCTION get_voucher_with_order_id (
    p_order_id UUID
)
RETURNS SETOF voucher
LANGUAGE sql
AS $$
    SELECT *
    FROM voucher
    WHERE order_id = p_order_id;
$$;