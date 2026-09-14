CREATE OR REPLACE FUNCTION create_chat_session (
    p_label VARCHAR(255),
    p_code VARCHAR(255),
    p_is_ready BOOLEAN,
    p_selected_account_id UUID,
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_session
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_chat_session_id UUID;
BEGIN
    -- Kiểm tra quyền admin
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE added_by_id = p_account_id
          AND account_id = p_selected_account_id
    ) THEN
        RAISE EXCEPTION 'Bạn không phải admin của tài khoản này.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo chatSession
    INSERT INTO chat_session (
        label,
        code,
        is_ready,
        status,
        selected_account_id,
        zalo_oa_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_label,
        p_code,
        p_is_ready,
        'normal',
        p_selected_account_id,
        p_zalo_oa_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_chat_session_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM chat_session
    WHERE id = v_new_chat_session_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

CREATE OR REPLACE FUNCTION update_selected_account_id_of_chat_session (
    p_id UUID,
    p_selected_account_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_session
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra account được chọn có thuộc tài khoản
    -- mà p_account_id là admin hay không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE added_by_id = p_account_id
          AND account_id = p_selected_account_id
    ) THEN
        RAISE EXCEPTION 'Bạn không phải admin của tài khoản này.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Update
    UPDATE chat_session
    SET selected_account_id = p_selected_account_id
    WHERE status = 'normal'
      AND id = p_id
      AND account_id = p_account_id;

    -- Tương đương @@ROWCOUNT = 0
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật chatSession không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về chatSession sau khi update
    RETURN QUERY
    SELECT *
    FROM chat_session
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_is_ready_of_chat_session (
    p_id UUID,
    p_is_ready BOOLEAN,
    p_account_id UUID
)
RETURNS SETOF chat_session
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE chat_session
    SET is_ready = p_is_ready
    WHERE status = 'normal'
      AND id = p_id
      AND account_id = p_account_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật chat_session không thành công.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN QUERY
    SELECT *
    FROM chat_session
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION leave_all_chat_session (
    p_account_id UUID
)
RETURNS TABLE (
    success BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_my_admin_id UUID;
BEGIN
    -- Lấy admin của account
    SELECT ai.added_by_id
    INTO v_my_admin_id
    FROM account_information AS ai
    WHERE ai.account_id = p_account_id
    LIMIT 1;

    IF v_my_admin_id IS NULL THEN
        RAISE EXCEPTION 'Không tồn tại 1 admin nào cho bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Chuyển các chat session đang được account này xử lý
    UPDATE chat_session
    SET selected_account_id = v_my_admin_id
    WHERE status = 'normal'
      AND selected_account_id = p_account_id;

    -- Kiểm tra còn session nào đang chọn account này không
    IF NOT EXISTS (
        SELECT 1
        FROM chat_session
        WHERE selected_account_id = p_account_id
    ) THEN
        RETURN QUERY
        SELECT TRUE;

        RETURN;
    END IF;

    RETURN QUERY
    SELECT FALSE;
END;
$$;