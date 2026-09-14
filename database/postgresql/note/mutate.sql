CREATE OR REPLACE FUNCTION create_note (
    p_note TEXT,
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS SETOF note
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_note_id UUID;
BEGIN
    -- Kiểm tra ChatRoom có tồn tại và thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE id = p_chat_room_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'ChatRoom không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra ChatRoom đã bị xóa
    IF EXISTS (
        SELECT 1
        FROM chat_room
        WHERE id = p_chat_room_id
          AND status = 'delete'
    ) THEN
        RAISE EXCEPTION 'ChatRoom đã bị xóa.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Tạo note
    INSERT INTO note (
        note,
        is_delete,
        chat_room_id,
        update_time,
        create_time
    )
    VALUES (
        p_note,
        FALSE,
        p_chat_room_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_note_id;

    -- Trả về note vừa tạo
    RETURN QUERY
    SELECT *
    FROM note
    WHERE id = v_new_note_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

CREATE OR REPLACE FUNCTION update_note (
    p_id UUID,
    p_note TEXT,
    p_account_id UUID
)
RETURNS SETOF note
LANGUAGE plpgsql
AS $$
DECLARE
    v_chat_room_id UUID;
BEGIN
    -- Lấy chatRoomId
    SELECT chat_room_id
    INTO v_chat_room_id
    FROM note
    WHERE id = p_id;

    IF v_chat_room_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thất chat_room_id của note .'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra note đã bị xóa
    IF EXISTS (
        SELECT 1
        FROM note
        WHERE id = p_id
          AND is_delete = TRUE
    ) THEN
        RAISE EXCEPTION 'Note này đã bị xóa .'
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
        RAISE EXCEPTION 'ChatRoom này không phải của bạn .'
            USING ERRCODE = 'P0003';
    END IF;

    -- Update
    UPDATE note
    SET note = p_note
    WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật ghi chú không thành công .'
            USING ERRCODE = 'P0004';
    END IF;

    -- Trả về note sau khi update
    RETURN QUERY
    SELECT *
    FROM note
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_note (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF note
LANGUAGE plpgsql
AS $$
DECLARE
    v_chat_room_id UUID;
BEGIN
    -- Lấy chatRoomId
    SELECT chat_room_id
    INTO v_chat_room_id
    FROM note
    WHERE id = p_id;

    IF v_chat_room_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thất chatRoomid của note .'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra note đã bị xóa
    IF EXISTS (
        SELECT 1
        FROM note
        WHERE id = p_id
          AND is_delete = TRUE
    ) THEN
        RAISE EXCEPTION 'Note này đã bị xóa .'
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
        RAISE EXCEPTION 'ChatRoom này không phải của bạn .'
            USING ERRCODE = 'P0003';
    END IF;

    -- Soft delete
    UPDATE note
    SET is_delete = TRUE
    WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Xóa ghi chú không thành công .'
            USING ERRCODE = 'P0004';
    END IF;

    -- Trả về note sau khi xóa
    RETURN QUERY
    SELECT *
    FROM note
    WHERE id = p_id;
END;
$$;