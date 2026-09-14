CREATE OR REPLACE FUNCTION create_agent (
    p_account_id UUID
)
RETURNS SETOF agent
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_agent_id UUID;
BEGIN
    -- Kiểm tra tài khoản có phải admin không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo agent
    INSERT INTO agent (
        type,
        expiry,
        status,
        agent_account_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        'basic',
        NULL,
        'normal',
        NULL,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_agent_id;

    -- Trả về agent vừa tạo
    RETURN QUERY
    SELECT *
    FROM agent
    WHERE id = v_new_agent_id;
END;
$$;

CREATE OR REPLACE FUNCTION agent_add_account (
    p_id UUID,
    p_account_id UUID,
	p_agent_account_id UUID DEFAULT NULL
)
RETURNS SETOF agent
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra tài khoản hiện tại có phải admin không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin !'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra member có thuộc danh sách của admin không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE added_by_id = p_account_id
          AND account_id = p_agent_account_id
    ) THEN
        RAISE EXCEPTION 'Thành viên này chưa có trong danh sách !'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra agent có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM agent
        WHERE id = p_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Agent này không phải của bạn !'
            USING ERRCODE = 'P0003';
    END IF;

    -- Update agent
    UPDATE agent
    SET agent_account_id = p_agent_account_id
    WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật agent không thành công.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Trả về agent sau khi update
    RETURN QUERY
    SELECT *
    FROM agent
    WHERE status = 'normal'
      AND id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION agent_del_account (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF agent
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra agent có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM agent
        WHERE id = p_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Agent này không phải của bạn !'
            USING ERRCODE = 'P0001';
    END IF;

    -- Xóa liên kết agent với account
    UPDATE agent
    SET agent_account_id = NULL
    WHERE id = p_id;

    -- Kiểm tra UPDATE có thành công không
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật agent không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về agent sau khi cập nhật
    RETURN QUERY
    SELECT *
    FROM agent
    WHERE status = 'normal'
      AND id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_agent_pay (
    p_agent_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    is_pay BOOLEAN,
    agent_id UUID,
    account_id UUID,
    update_time TIMESTAMPTZ,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra account có phải admin không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin .'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra đã tồn tại agentPay chưa thanh toán
    IF EXISTS (
        SELECT 1
        FROM agent_pay
        WHERE account_id = p_account_id
          AND agent_id = p_agent_id
          AND is_pay = FALSE
    ) THEN
        RAISE EXCEPTION 'Đã tồn tại 1 agentPay .'
            USING ERRCODE = 'P0002';
    END IF;

    -- Insert và trả về record vừa tạo
    INSERT INTO agent_pay (
        is_pay,
        agent_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        FALSE,
        p_agent_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING
        agent_pay.id,
        agent_pay.is_pay,
        agent_pay.agent_id,
        agent_pay.account_id,
        agent_pay.update_time,
        agent_pay.create_time
    INTO
        id,
        is_pay,
        agent_id,
        account_id,
        update_time,
        create_time;

    RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION update_agent_paid (
    p_id UUID
)
RETURNS SETOF agent_pay
LANGUAGE plpgsql
AS $$
DECLARE
    v_agent_id UUID;
BEGIN
    -- Kiểm tra agentPay chưa được thanh toán
    IF NOT EXISTS (
        SELECT 1
        FROM agent_pay
        WHERE is_pay = false
          AND id = p_id
    ) THEN
        RAISE EXCEPTION 'Chưa tồn tại 1 agentPay.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Lấy agentId
    SELECT agent_id
    INTO v_agent_id
    FROM agent_pay
    WHERE id = p_id;

    IF v_agent_id IS NULL THEN
        RAISE EXCEPTION 'Agent không tồn tại'
            USING ERRCODE = 'P0003';
    END IF;

    -- Cập nhật agentPay
    UPDATE agent_pay
    SET is_pay = true
    WHERE id = p_id
      AND is_pay = false;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật agentPay không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Cập nhật agent
    UPDATE agent
    SET
        expiry = CURRENT_TIMESTAMP + INTERVAL '1 month',
        type = 'upgrade'
    WHERE id = v_agent_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật agent không thành công.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Trả về agentPay
    RETURN QUERY
    SELECT *
    FROM agent_pay
    WHERE id = p_id;
END;
$$;