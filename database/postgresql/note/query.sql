CREATE OR REPLACE FUNCTION get_my_notes (
    p_page INT,
    p_size INT,
    p_offset INT,
    p_chat_room_id UUID,
    p_account_id UUID,
	p_is_delete BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_data JSON;
    v_total_count BIGINT;
BEGIN
    -- Kiểm tra ChatRoom có tồn tại và thuộc account
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
        json_agg(row_data ORDER BY row_data.id DESC),
        '[]'::JSON
    )
    INTO v_data
    FROM (
        SELECT n.*
        FROM note AS n
        WHERE n.chat_room_id = p_chat_room_id
          AND (
              p_is_delete IS NULL
              OR n.is_delete = p_is_delete
          )
        ORDER BY n.id DESC
        OFFSET ((p_page - 1) * p_size + p_offset)
        LIMIT p_size
    ) AS row_data;

    -- Tổng số dòng
    SELECT COUNT(*)
    INTO v_total_count
    FROM note AS n
    WHERE n.chat_room_id = p_chat_room_id
      AND (
          p_is_delete IS NULL
          OR n.is_delete = p_is_delete
      );

    -- Trả về cả data + totalCount
    RETURN json_build_object(
        'data', v_data,
        'totalCount', v_total_count
    );
END;
$$;