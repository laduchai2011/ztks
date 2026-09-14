CREATE OR REPLACE FUNCTION create_order (
    p_uuid VARCHAR(255),
    p_label VARCHAR(255),
    p_content TEXT,
    p_money NUMERIC(20,2),
    p_phone VARCHAR(255),
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    uuid VARCHAR(255),
    label VARCHAR(255),
    content TEXT,
    money NUMERIC(20,2),
    is_pay BOOLEAN,
    phone VARCHAR(255),
    is_delete BOOLEAN,
    chat_room_id UUID,
    update_time TIMESTAMPTZ,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE id = p_chat_room_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'ChatRoom không tồn tại .'
            USING ERRCODE = 'P0001';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM chat_room
        WHERE id = p_chat_room_id
          AND status = 'delete'
    ) THEN
        RAISE EXCEPTION 'ChatRoom đã bị xóa .'
            USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO orderr (
        uuid,
        label,
        content,
        money,
        is_pay,
        phone,
        is_delete,
        chat_room_id,
        update_time,
        create_time
    )
    VALUES (
        p_uuid,
        p_label,
        p_content,
        p_money,
        FALSE,
        p_phone,
        FALSE,
        p_chat_room_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING
        orderr.id,
        orderr.uuid,
        orderr.label,
        orderr.content,
        orderr.money,
        orderr.is_pay,
        orderr.phone,
        orderr.is_delete,
        orderr.chat_room_id,
        orderr.update_time,
        orderr.create_time
    INTO
        id,
        uuid,
        label,
        content,
        money,
        is_pay,
        phone,
        is_delete,
        chat_room_id,
        update_time,
        create_time;

    RETURN NEXT;

END;
$$;

CREATE OR REPLACE FUNCTION update_order (
    p_id UUID,
    p_label VARCHAR(255),
    p_content TEXT,
    p_money DECIMAL(20,2),
    p_phone VARCHAR(255),
    p_account_id UUID
)
RETURNS SETOF orderr
LANGUAGE plpgsql
AS $$
DECLARE
    v_chat_room_id UUID;
    v_phone_voucher UUID;
BEGIN
    -- Lấy chatRoomId
    SELECT o.chat_room_id
    INTO v_chat_room_id
    FROM orderr o
    WHERE o.id = p_id;

    IF v_chat_room_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy chatRoomId của order.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra order đã bị xóa
    IF EXISTS (
        SELECT 1
        FROM orderr
        WHERE id = p_id
          AND is_delete = TRUE
    ) THEN
        RAISE EXCEPTION 'Order này đã bị xóa.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra chatRoom thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE status = 'normal'
          AND id = v_chat_room_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'ChatRoom này không phải của bạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Lấy phone của voucher
    SELECT v.phone
    INTO v_phone_voucher
    FROM voucher v
    WHERE v.order_id = p_id;

    -- Nếu phone voucher khác phone mới thì bỏ voucher cũ
    IF v_phone_voucher IS NOT NULL THEN
        IF NOT (p_phone IS NOT NULL AND v_phone_voucher = p_phone::INT) THEN

            UPDATE voucher
            SET order_id = NULL
            WHERE order_id = p_id;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Bỏ voucher cũ không thành công.'
                    USING ERRCODE = 'P0004';
            END IF;

        END IF;
    END IF;

    -- Update order
    UPDATE orderr
    SET
        label = p_label,
        content = p_content,
        money = p_money,
        phone = p_phone,
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_id
      AND is_pay = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật đơn hàng không thành công.'
            USING ERRCODE = 'P0005';
    END IF;

    -- Trả order sau khi update
    RETURN QUERY
    SELECT *
    FROM orderr
    WHERE id = p_id;

END;
$$;

CREATE OR REPLACE FUNCTION create_order_status ( 
    p_type VARCHAR(255),
    p_content VARCHAR(255),
    p_order_id UUID,
    p_account_id UUID
)
RETURNS SETOF order_status
LANGUAGE plpgsql
AS $$
DECLARE
    v_chat_room_id UUID;
    v_new_order_status_id UUID;
BEGIN
    -- Lấy chatRoomId của order
    SELECT o.chat_room_id
    INTO v_chat_room_id
    FROM orderr o
    WHERE o.id = p_order_id;

    IF v_chat_room_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy chatRoomId của order.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra chatRoom có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE status = 'normal'
          AND id = v_chat_room_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'ChatRoom này không phải của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Insert orderStatus
    INSERT INTO order_status (
        type,
        content,
        order_id,
        create_time
    )
    VALUES (
        p_type,
        p_content,
        p_order_id,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_order_status_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM order_status
    WHERE id = v_new_order_status_id;

END;
$$;