CREATE OR REPLACE FUNCTION create_zalo_oa (
    p_label VARCHAR(255),
    p_oa_id VARCHAR(255),
    p_oa_name VARCHAR(255),
    p_oa_secret VARCHAR(255),
    p_zalo_app_id UUID,
    p_account_id UUID
)
RETURNS zalo_oa
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_zalo_oa_id UUID;
    v_zalo_oa zalo_oa;
BEGIN
    -- Kiểm tra zaloApp có thuộc account hay không
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_app
        WHERE id = p_zalo_app_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải zaloApp của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo zaloOa
    INSERT INTO zalo_oa (
        label,
        oa_id,
        oa_name,
        oa_secret,
        status,
        zalo_app_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_label,
        p_oa_id,
        p_oa_name,
        p_oa_secret,
        'normal',
        p_zalo_app_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_zalo_oa_id;

    -- Tạo statisticsOa
    INSERT INTO statistics_oa (
        sales,
        order_amount,
        zalo_oa_id,
        of_day,
        create_time
    )
    VALUES (
        0,
        0,
        v_new_zalo_oa_id,
        CURRENT_DATE,
        CURRENT_TIMESTAMP
    );

    -- Tạo statisticsMemberInOneMonth
    INSERT INTO statistics_member_in_one_month (
        sales,
        order_amount,
        flag,
        of_month,
        zalo_oa_id,
        account_id,
        create_time
    )
    VALUES (
        0,
        0,
        'new',
        DATE_TRUNC('month', CURRENT_DATE)::DATE,
        v_new_zalo_oa_id,
        p_account_id,
        CURRENT_TIMESTAMP
    );

    -- Lấy zaloOa vừa tạo
    SELECT *
    INTO v_zalo_oa
    FROM zalo_oa
    WHERE id = v_new_zalo_oa_id;

    RETURN v_zalo_oa;
END;
$$;

CREATE OR REPLACE FUNCTION edit_zalo_oa (
    p_id UUID,
    p_label VARCHAR(255),
    p_oa_id VARCHAR(255),
    p_oa_name VARCHAR(255),
    p_oa_secret VARCHAR(255),
    p_zalo_app_id UUID,
    p_account_id UUID
)
RETURNS SETOF zalo_oa
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra zaloApp thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_app
        WHERE id = p_zalo_app_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải zaloApp của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra zaloOa thuộc zaloApp
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE id = p_id
          AND zalo_app_id = p_zalo_app_id
    ) THEN
        RAISE EXCEPTION 'OA không phải của zaloApp này.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Update
    UPDATE zalo_oa
    SET
        label = p_label,
        oa_id = p_oa_id,
        oa_name = p_oa_name,
        oa_secret = p_oa_secret,
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_id
      AND status = 'normal';

    -- Kiểm tra update có thành công không
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật zaloOa không thành công.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Tương đương SELECT * FROM dbo.zaloOa WHERE id = @id
    RETURN QUERY
    SELECT *
    FROM zalo_oa
    WHERE id = p_id;
END;
$$;

-- DROP FUNCTION IF EXISTS create_zalo_oa_token(TEXT, UUID, UUID);
CREATE OR REPLACE FUNCTION create_zalo_oa_token (
    p_refresh_token TEXT,
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF zalo_oa_token
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra OA có thuộc account không
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE id = p_zalo_oa_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải OA của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo token
    INSERT INTO zalo_oa_token (
        refresh_token,
        zalo_oa_id
    )
    VALUES (
        p_refresh_token,
        p_zalo_oa_id
    );

    -- Trả về zalo_oa_toen
    RETURN QUERY
    SELECT *
    FROM zalo_oa_token
    WHERE id = p_zalo_oa_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_refresh_token_of_zalo_oa (
    p_refresh_token TEXT,
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF zalo_oa_token
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
BEGIN
    -- Lấy addedById
    SELECT ai.added_by_id
    INTO v_added_by_id
    FROM account_information ai
    WHERE ai.account_id = p_account_id;

    IF v_added_by_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy addedById.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra OA có thuộc account này không
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa zo
        WHERE zo.id = p_zalo_oa_id
          AND zo.account_id = v_added_by_id
    ) THEN
        RAISE EXCEPTION 'Không phải OA của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Update refresh token
    UPDATE zalo_oa_token
    SET refresh_token = p_refresh_token
    WHERE zalo_oa_id = p_zalo_oa_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật refreshToken của zaloOa không thành công.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Trả về token sau khi update
    RETURN QUERY
    SELECT *
    FROM zalo_oa_token
    WHERE zalo_oa_id = p_zalo_oa_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_zns_template (
    p_tem_id VARCHAR(255),
    p_images TEXT,
    p_data_fields TEXT,
    p_phone_cost DECIMAL(20,2),
    p_uid_cost DECIMAL(20,2),
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF zns_template
LANGUAGE plpgsql
AS $$
DECLARE
    v_zns_template_id UUID;
BEGIN
    -- Kiểm tra OA có thuộc account hay không
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE id = p_zalo_oa_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải OA của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo ZNS template
    INSERT INTO zns_template (
        tem_id,
        images,
        data_fields,
        phone_cost,
        uid_cost,
        is_delete,
        zalo_oa_id,
        update_time,
        create_time
    )
    VALUES (
        p_tem_id,
        p_images,
        p_data_fields,
        p_phone_cost,
        p_uid_cost,
        FALSE,
        p_zalo_oa_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_zns_template_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM zns_template
    WHERE id = v_zns_template_id;
END;
$$;

CREATE OR REPLACE FUNCTION edit_zns_template (
    p_id UUID,
    p_tem_id VARCHAR(255),
    p_images TEXT,
    p_data_fields TEXT,
    p_phone_cost DECIMAL(20,2),
    p_uid_cost DECIMAL(20,2),
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF zns_template
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra OA có thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE id = p_zalo_oa_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải OA của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra template có tồn tại và thuộc OA
    IF NOT EXISTS (
        SELECT 1
        FROM zns_template
        WHERE id = p_id
          AND zalo_oa_id = p_zalo_oa_id
    ) THEN
        RAISE EXCEPTION 'Không tồn tại znsTemplate này.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Update
    UPDATE zns_template
    SET
        tem_id = p_tem_id,
        images = p_images,
        data_fields = p_data_fields,
        phone_cost = p_phone_cost,
        uid_cost = p_uid_cost
    WHERE id = p_id
      AND is_delete = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật znsTemplate của zaloOa không thành công.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Trả về template sau khi update
    RETURN QUERY
    SELECT *
    FROM zns_template
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_zns_message (
    p_type VARCHAR(255),
    p_data TEXT,
    p_cost DECIMAL(20,2),
    p_zns_template_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    type VARCHAR(255),
    data TEXT,
    cost DECIMAL(20,2),
    znsTemplateId UUID,
    accountId UUID,
    createTime TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_zalo_oa_id UUID;
    v_admin_id UUID;
    v_zns_message_id UUID;
BEGIN
    -- Lấy zaloOaId từ znsTemplate
    SELECT zalo_oa_id
    INTO v_zalo_oa_id
    FROM zns_template
    WHERE id = p_zns_template_id;

    IF v_zalo_oa_id IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'Không tìm thấy zalo_oa_id của znsTemplate.',
            DETAIL = 'zns_template_id = ' || p_zns_template_id;
    END IF;

    -- Lấy adminId của OA
    SELECT account_id
    INTO v_admin_id
    FROM zalo_oa
    WHERE id = v_zalo_oa_id;

    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'Không tìm thấy adminId của zalo_oa.',
            DETAIL = 'zalo_oa_id = ' || v_zalo_oa_id;
    END IF;

    -- Kiểm tra quyền
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE added_by_id = v_admin_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'Bạn không có quyền trên oa này.',
            DETAIL = 'account_id = ' || p_account_id;
    END IF;

    -- Insert
    INSERT INTO zns_nessage (
        type,
        data,
        cost,
        zns_template_id,
        account_id,
        create_time
    )
    VALUES (
        p_type,
        p_data,
        p_cost,
        p_zns_template_id,
        p_account_id,
        CURRENT_TIMESTAMP
    )
    RETURNING zns_message.id
    INTO v_zns_message_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT
        zm.id,
        zm.type,
        zm.data,
        zm.cost,
        zm.zns_template_id,
        zm.account_id,
        zm.create_time
    FROM zns_message zm
    WHERE zm.id = v_zns_message_id;
END;
$$;