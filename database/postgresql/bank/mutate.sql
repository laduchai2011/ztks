CREATE OR REPLACE FUNCTION add_bank (
    p_bank_code VARCHAR(255),
    p_account_number VARCHAR(255),
    p_account_name VARCHAR(255),
    p_account_id UUID
)
RETURNS SETOF bank
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_bank_id UUID;
BEGIN
    INSERT INTO bank (
        bank_code,
        account_number,
        account_name,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_bank_code,
        p_account_number,
        p_account_name,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_bank_id;

    RETURN QUERY
    SELECT *
    FROM bank
    WHERE id = v_new_bank_id;
END;
$$;

CREATE OR REPLACE FUNCTION edit_bank (
    p_id UUID,
    p_bank_code VARCHAR(255),
    p_account_number VARCHAR(255),
    p_account_name VARCHAR(255),
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    bank_code VARCHAR(255),
    account_number VARCHAR(255),
    account_name VARCHAR(255),
    account_id UUID,
    update_time TIMESTAMPTZ,
    create_time TIMESTAMPTZ,
    is_delete BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra bank có thuộc account hay không
    IF NOT EXISTS (
        SELECT 1
        FROM bank
        WHERE account_id = p_account_id
          AND id = p_id
    ) THEN
        RAISE EXCEPTION 'Ngân hàng này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Update
    UPDATE bank
    SET
        bank_code = p_bank_code,
        account_number = p_account_number,
        account_name = p_account_name,
        update_time = NOW()
    WHERE id = p_id
      AND is_delete = FALSE;

    -- Không update được
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Thay đổi thông tin ngân hàng thất bại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về bank sau khi update
    RETURN QUERY
    SELECT
        b.id,
        b.bank_code,
        b.account_number,
        b.account_name,
        b.account_id,
        b.update_time,
        b.create_time,
        b.is_delete
    FROM bank b
    WHERE b.id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_bank (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF bank
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra ngân hàng có thuộc account hay không
    IF NOT EXISTS (
        SELECT 1
        FROM bank
        WHERE account_id = p_account_id
          AND id = p_id
    ) THEN
        RAISE EXCEPTION 'Ngân hàng này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Soft delete
    UPDATE bank
    SET
        is_delete = TRUE,
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_id
      AND is_delete = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Xóa thông tin ngân hàng thất bại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về record sau khi xóa
    RETURN QUERY
    SELECT *
    FROM bank
    WHERE id = p_id;
END;
$$;