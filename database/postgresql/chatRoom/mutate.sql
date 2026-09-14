CREATE OR REPLACE FUNCTION create_chat_room (
    p_user_id_by_app VARCHAR(255),
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_room
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_chat_room_id UUID;
BEGIN
    -- Tạo chatRoom
    INSERT INTO chat_room (
        user_id_by_app,
        status,
        zalo_oa_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_user_id_by_app,
        'normal',
        p_zalo_oa_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_chat_room_id;

    IF v_new_chat_room_id IS NULL THEN
        RAISE EXCEPTION 'Tạo chatRoom không thành công.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo chatRoomRole
    INSERT INTO chat_room_role (
        authorized_account_id,
        is_read,
        is_send,
        status,
        chat_room_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_account_id,
        TRUE,
        TRUE,
        'normal',
        v_new_chat_room_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tạo chatRoomRole không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Tạo chatRoomMasterMembers
    INSERT INTO chat_room_master_members (
        chat_room_id,
        account_id,
        create_time
    )
    VALUES (
        v_new_chat_room_id,
        p_account_id,
        CURRENT_TIMESTAMP
    );

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tạo chatRoomMasterMembers không thành công.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Trả về chatRoom vừa tạo
    RETURN QUERY
    SELECT *
    FROM chat_room
    WHERE id = v_new_chat_room_id;

END;
$$;

CREATE OR REPLACE FUNCTION update_setup_chat_room_role (
    p_id UUID,
    p_background_color VARCHAR(255),
    p_is_read BOOLEAN,
    p_is_send BOOLEAN,
    p_account_id UUID
)
RETURNS SETOF chat_room_role
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE chat_room_role
    SET
        background_color = p_background_color,
        is_read = p_is_read,
        is_send = p_is_send
    WHERE id = p_id
      AND account_id = p_account_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật chatRoomRole không thành công.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN QUERY
    SELECT *
    FROM chat_room_role
    WHERE id = p_id
      AND account_id = p_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION change_chat_room_master (
    p_chat_room_id UUID,
    p_new_account_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_room
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
    v_old_call_agent_id UUID;
    v_new_call_agent_id UUID;
BEGIN
    -- 1. Kiểm tra chatRoom có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE account_id = p_account_id
          AND id = p_chat_room_id
    ) THEN
        RAISE EXCEPTION 'Không phải chatRoom của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 2. Lấy admin của account cũ
    SELECT added_by_id
    INTO v_added_by_id
    FROM account_information
    WHERE account_id = p_account_id;

    IF v_added_by_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy admin cho tài khoản cũ.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Kiểm tra account mới cùng admin với account cũ
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_new_account_id
          AND added_by_id = v_added_by_id
    ) THEN
        RAISE EXCEPTION 'Admin của tài khoản cũ không phải là của tài khoản mới.'
            USING ERRCODE = 'P0003';
    END IF;

    -- 4. Đổi master của chatRoom
    UPDATE chat_room
    SET account_id = p_new_account_id
    WHERE id = p_chat_room_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật chatRoom không thành công.'
            USING ERRCODE = 'P0004';
    END IF;

    -- 5. Xóa toàn bộ role cũ
    DELETE FROM chat_room_role
    WHERE chat_room_id = p_chat_room_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Xóa chatRoomRole không thành công.'
            USING ERRCODE = 'P0005';
    END IF;

    -- 6. Tạo role cho master mới
    INSERT INTO chat_room_role (
        authorized_account_id,
        is_read,
        is_send,
        status,
        chat_room_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_new_account_id,
        TRUE,
        TRUE,
        'normal',
        p_chat_room_id,
        p_new_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tạo chatRoomRole không thành công.'
            USING ERRCODE = 'P0006';
    END IF;

    -- 7. Lấy callAgent của account cũ
    SELECT id
    INTO v_old_call_agent_id
    FROM call_agent
    WHERE account_id = p_account_id;

    IF v_old_call_agent_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy oldCallAgentId.'
            USING ERRCODE = 'P0007';
    END IF;

    -- 8. Lấy callAgent của account mới
    SELECT id
    INTO v_new_call_agent_id
    FROM call_agent
    WHERE account_id = p_new_account_id;

    IF v_new_call_agent_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy newCallAgentId.'
            USING ERRCODE = 'P0008';
    END IF;

    -- 9. Chuyển callPermit sang callAgent mới
    UPDATE call_permit
    SET call_agent_id = v_new_call_agent_id
    WHERE call_agent_id = v_old_call_agent_id
      AND is_delete = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật callPermit không thành công.'
            USING ERRCODE = 'P0009';
    END IF;

    -- 10. Thêm master member
    INSERT INTO chat_room_master_members (
        chat_room_id,
        account_id,
        create_time
    )
    VALUES (
        p_chat_room_id,
        p_new_account_id,
        CURRENT_TIMESTAMP
    );

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tạo chatRoomMasterMembers không thành công.'
            USING ERRCODE = 'P0010';
    END IF;

    -- 11. Trả về chatRoom
    RETURN QUERY
    SELECT *
    FROM chat_room
    WHERE id = p_chat_room_id;

END;
$$;

CREATE OR REPLACE FUNCTION create_chat_room_phone (
    p_phone VARCHAR(15),
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_room_phone
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_chat_room_phone_id UUID;
BEGIN
    -- Kiểm tra chatRoom có thuộc account hay không
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE account_id = p_account_id
          AND id = p_chat_room_id
    ) THEN
        RAISE EXCEPTION 'Không phải chatRoom của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo chatRoomPhone
    INSERT INTO chat_room_phone (
        phone,
        chat_room_id,
        create_time
    )
    VALUES (
        p_phone,
        p_chat_room_id,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_chat_room_phone_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM chat_room_phone
    WHERE id = v_new_chat_room_phone_id;
END;
$$;