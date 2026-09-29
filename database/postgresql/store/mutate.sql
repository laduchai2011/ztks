CREATE OR REPLACE FUNCTION create_shop (
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_address VARCHAR(255),
    p_phone VARCHAR(255),
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    account_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
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
	
    -- Tạo shop
    INSERT INTO shop (
        name,
        description,
        content,
        address,
        phone,
        account_id
    )
    VALUES (
        p_name,
        p_description,
        p_content,
        p_address,
        p_phone,
        p_account_id
    )
    RETURNING shop.id
    INTO v_shop_id;

    -- Tạo shop_pay
    INSERT INTO shop_pay (
		expiry,
        shop_id,
        account_id
    )
    VALUES (
		CURRENT_TIMESTAMP + INTERVAL '30 days',
        v_shop_id,
        p_account_id
    );

    -- Trả về shop vừa tạo
    RETURN QUERY
    SELECT
        s.id,
        s.name,
        s.description,
        s.content,
        s.address,
        s.phone,
        s.is_delete,
        s.account_id,
        s.create_time
    FROM shop s
    WHERE s.id = v_shop_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_depot (
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_address VARCHAR(255),
    p_phone VARCHAR(255),
    p_shop_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    shop_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO depot (
        name,
        description,
        content,
        address,
        phone,
        shop_id
    )
    VALUES (
        p_name,
        p_description,
        p_content,
        p_address,
        p_phone,
        p_shop_id
    )
    RETURNING
        depot.id,
        depot.name,
        depot.description,
        depot.content,
        depot.address,
        depot.phone,
        depot.is_delete,
        depot.shop_id,
        depot.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION create_store (
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_depot_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    is_delete BOOLEAN,
    depot_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO store (
        name,
        description,
        content,
        depot_id
    )
    VALUES (
        p_name,
        p_description,
        p_content,
        p_depot_id
    )
    RETURNING
        store.id,
        store.name,
        store.description,
        store.content,
        store.is_delete,
        store.depot_id,
        store.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION create_shop_pay (
	p_money DECIMAL(20,2),
    p_shop_id UUID,
    p_account_id UUID
)
RETURNS shop_pay
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_pay shop_pay;
BEGIN
	-- Kiểm tra shop thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_app
        WHERE id = p_zalo_app_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải shop của bạn.'
            USING ERRCODE = 'P0001';
    END IF;
	
    INSERT INTO shop_pay (
        money,
        shop_id,
        account_id
    )
    VALUES (
        p_money,
        p_shop_id,
        p_account_id
    )
    RETURNING *
    INTO v_shop_pay;

    RETURN v_shop_pay;
END;
$$;