-- DROP FUNCTION IF EXISTS get_orders(
--     INT,
--     INT,
--     UUID,
-- 	UUID,
-- 	VARCHAR,
-- 	DECIMAL,
-- 	DECIMAL,
-- 	BOOLEAN,
-- 	VARCHAR,
-- 	BOOLEAN
-- );
CREATE OR REPLACE FUNCTION get_orders (
    p_page INT,
    p_size INT,
	p_chat_room_id UUID,
    p_account_id UUID,
    p_uuid VARCHAR(255) DEFAULT NULL,
    p_money_from DECIMAL(20,2) DEFAULT NULL,
    p_money_to DECIMAL(20,2) DEFAULT NULL,
    p_is_pay BOOLEAN DEFAULT NULL,
    p_phone VARCHAR(255) DEFAULT NULL,
    p_is_delete BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_items JSONB;
    v_total_count BIGINT;
BEGIN
    -- Kiểm tra ChatRoom tồn tại và thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE id = p_chat_room_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'ChatRoom không tồn tại .'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra ChatRoom đã bị xóa
    IF EXISTS (
        SELECT 1
        FROM chat_room
        WHERE id = p_chat_room_id
          AND status = 'delete'
    ) THEN
        RAISE EXCEPTION 'ChatRoom đã bị xóa .'
            USING ERRCODE = 'P0002';
    END IF;

    -- Dữ liệu phân trang
    SELECT COALESCE(
        jsonb_agg(to_jsonb(t) - 'rn' ORDER BY t.id DESC),
        '[]'::jsonb
    )
    INTO v_items
    FROM (
        SELECT
            o.*,
            ROW_NUMBER() OVER (ORDER BY o.id DESC) AS rn
        FROM orderr AS o
        WHERE
            o.chat_room_id = p_chat_room_id
            AND (p_uuid IS NULL OR o.uuid = p_uuid)
            AND (p_money_from IS NULL OR o.money >= p_money_from)
            AND (p_money_to IS NULL OR o.money <= p_money_to)
            AND (p_is_pay IS NULL OR o.is_pay = p_is_pay)
            AND (p_phone IS NULL OR o.phone LIKE '%' || p_phone || '%')
            AND (p_is_delete IS NULL OR o.is_delete = p_is_delete)
    ) AS t
    WHERE t.rn BETWEEN ((p_page - 1) * p_size + 1)
                    AND (p_page * p_size);

    -- Tổng số dòng
    SELECT COUNT(*)
    INTO v_total_count
    FROM orderr AS o
    WHERE
        o.chat_room_id = p_chat_room_id
        AND (p_uuid IS NULL OR o.uuid = p_uuid)
        AND (p_money_from IS NULL OR o.money >= p_money_from)
        AND (p_money_to IS NULL OR o.money <= p_money_to)
        AND (p_is_pay IS NULL OR o.is_pay = p_is_pay)
        AND (p_phone IS NULL OR o.phone LIKE '%' || p_phone || '%')
        AND (p_is_delete IS NULL OR o.is_delete = p_is_delete);

    RETURN QUERY
    SELECT v_items, v_total_count;
END;
$$;

CREATE OR REPLACE FUNCTION get_order_with_id (
    p_id UUID
)
RETURNS SETOF orderr
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM orderr
    WHERE id = p_id
      AND is_delete = FALSE;
END;
$$;

-- DROP FUNCTION IF EXISTS get_orders_with_phone(
--     INT,
--     INT,
--     VARCHAR
-- );
CREATE OR REPLACE FUNCTION get_orders_with_phone (
    p_page INT,
    p_size INT,
    p_phone VARCHAR(255)
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
            jsonb_agg(to_jsonb(t) - 'rn' ORDER BY t.id DESC),
            '[]'::jsonb
        ),
        (
            SELECT COUNT(*)
            FROM orderr AS o
            WHERE o.is_delete = FALSE
              AND o.phone = p_phone
        )
    INTO items, total_count
    FROM (
        SELECT
            o.*,
            ROW_NUMBER() OVER (ORDER BY o.id DESC) AS rn
        FROM orderr AS o
        WHERE o.is_delete = FALSE
          AND o.phone = p_phone
    ) AS t
    WHERE t.rn BETWEEN
        ((p_page - 1) * p_size + 1)
        AND
        (p_page * p_size);
END;
$$;

CREATE OR REPLACE FUNCTION get_all_order_status (
    p_order_id UUID
)
RETURNS SETOF order_status
LANGUAGE sql
AS $$
    SELECT *
    FROM order_status
    WHERE order_id = p_order_id
    ORDER BY id DESC;
$$;