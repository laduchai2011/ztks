CREATE OR REPLACE FUNCTION create_call_permit (
    p_uid VARCHAR(255),
    p_app_id VARCHAR(255),
    p_oa_id VARCHAR(255),
    p_call_agent_id UUID,
    p_account_id UUID
)
RETURNS SETOF call_permit
LANGUAGE plpgsql
AS $$
DECLARE
    v_zalo_trunk_id UUID;
    v_new_call_permit_id UUID;
BEGIN
    -- Kiểm tra callAgent có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM call_agent
        WHERE id = p_call_agent_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'callAgent này không phải của bạn .'
            USING ERRCODE = 'P0001';
    END IF;

    -- Lấy zaloTrunk
    SELECT id
    INTO v_zalo_trunk_id
    FROM zalo_trunk
    WHERE domain = p_app_id || '.zcc.openapi.zaloapp.com'
      AND from_user = p_oa_id
    LIMIT 1;

    -- Tạo callPermit
    INSERT INTO call_permit (
        uid,
        call_agent_id,
        zalo_trunk_id
    )
    VALUES (
        p_uid,
        p_call_agent_id,
        v_zalo_trunk_id
    )
    RETURNING id INTO v_new_call_permit_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM call_permit
    WHERE id = v_new_call_permit_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

CREATE OR REPLACE FUNCTION create_zalo_trunk (
    p_trunk_code VARCHAR(255),
    p_app_id VARCHAR(255),
    p_oa_id VARCHAR(255),
    p_port VARCHAR(255),
    p_account_id UUID
)
RETURNS SETOF zalo_trunk
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_zalo_trunk_id UUID;
BEGIN
    -- Kiểm tra zaloApp thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_app
        WHERE app_id = p_app_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải zaloApp của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra zaloOa thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE oa_id = p_oa_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải zaloOa của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Insert zaloTrunk
    INSERT INTO zalo_trunk (
        trunk_code,
        domain,
        from_user,
        contact,
        account_id
    )
    VALUES (
        p_trunk_code,
        p_app_id || '.zcc.openapi.zaloapp.com',
        p_oa_id,
        'sip:' || p_app_id || '.zcc.openapi.zaloapp.com:' || p_port,
        p_account_id
    )
    RETURNING id INTO v_new_zalo_trunk_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM zalo_trunk
    WHERE id = v_new_zalo_trunk_id;

END;
$$;