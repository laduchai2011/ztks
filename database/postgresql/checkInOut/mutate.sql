CREATE OR REPLACE FUNCTION create_check_in_out (
    p_type VARCHAR(255),
    p_note VARCHAR(255),
    p_account_id UUID,
	p_image VARCHAR(255) DEFAULT NULL,
    p_video VARCHAR(255) DEFAULT NULL
)
RETURNS SETOF check_in_out
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_id UUID;
BEGIN
    INSERT INTO check_in_out (
        type,
        note,
        image,
        video,
        account_id,
        create_time
    )
    VALUES (
        p_type,
        p_note,
        p_image,
        p_video,
        p_account_id,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_id;

    IF v_new_id IS NULL THEN
        RAISE EXCEPTION 'Tạo CheckInOut không thành công.';
    END IF;

    RETURN QUERY
    SELECT *
    FROM check_in_out
    WHERE id = v_new_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_check_in_out_inspect (
    p_content VARCHAR(255),
    p_is_pass BOOLEAN,
    p_check_in_out_id UUID,
    p_account_id UUID
)
RETURNS SETOF check_in_out_inspect
LANGUAGE plpgsql
AS $$
DECLARE
    v_account_id_member UUID;
    v_new_id UUID;
BEGIN
    -- Kiểm tra tài khoản admin
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Lấy accountId của nhân viên từ CheckInOut
    SELECT account_id
    INTO v_account_id_member
    FROM check_in_out
    WHERE id = p_check_in_out_id;

    IF v_account_id_member IS NULL THEN
        RAISE EXCEPTION 'Không thấy tài khoản nhân viên của check in/out này.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra nhân viên thuộc admin này
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE added_by_id = p_account_id
          AND account_id = v_account_id_member
    ) THEN
        RAISE EXCEPTION 'Không phải nhân viên của tài khoản này.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Tạo CheckInOutInspect
    INSERT INTO check_in_out_inspect (
        content,
        is_pass,
        check_in_out_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_content,
        p_is_pass,
        p_check_in_out_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_id;

    IF v_new_id IS NULL THEN
        RAISE EXCEPTION 'Tạo CheckInOutInspect không thành công.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM check_in_out_inspect
    WHERE id = v_new_id;
END;
$$;