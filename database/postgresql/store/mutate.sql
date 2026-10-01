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
        FROM account_information ai
        WHERE ai.account_id = p_account_id
          AND ai.account_type = 'admin'
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
    p_shop_id UUID,
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
    shop_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
	 IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Không phải SHOP của bạn.'
            USING ERRCODE = 'P0001';
    END IF;
	
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
    p_depot_id UUID,
    p_account_id UUID
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
    -- Kiểm tra depot có tồn tại và thuộc shop của account
    IF NOT EXISTS (
        SELECT 1
        FROM depot d
        INNER JOIN shop s
            ON s.id = d.shop_id
        WHERE d.id = p_depot_id
          AND s.account_id = p_account_id
          AND d.is_delete = FALSE
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot does not belong to this account';
    END IF;

    -- Tạo store
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

CREATE OR REPLACE FUNCTION edit_shop (
	p_id UUID,
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
BEGIN
	RETURN QUERY
	UPDATE shop s
	SET
	    name = p_name,
	    description = p_description,
		content = p_content,
	    address = p_address,
	    phone = p_phone
	WHERE s.id = p_id AND s.account_id = p_account_id AND s.is_delete = FALSE
	RETURNING
	    s.id,
	    s.name,
	    s.description,
	    s.content,
	    s.address,
	    s.phone,
	    s.is_delete,
	    s.account_id,
	    s.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION delete_shop (
	p_id UUID,
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
BEGIN
	RETURN QUERY
	UPDATE shop s
	SET is_delete = TRUE
	WHERE s.id = p_id AND s.account_id = p_account_id AND s.is_delete = FALSE
	RETURNING
	    s.id,
	    s.name,
	    s.description,
	    s.content,
	    s.address,
	    s.phone,
	    s.is_delete,
	    s.account_id,
	    s.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION edit_depot (
    p_id UUID,
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
    shop_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
BEGIN
    -- 1. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = p_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 2. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Update depot
    RETURN QUERY
    UPDATE depot d
    SET
        name = p_name,
        description = p_description,
        content = p_content,
        address = p_address,
        phone = p_phone
    WHERE d.id = p_id
      AND d.is_delete = FALSE
    RETURNING
        d.id,
        d.name,
        d.description,
        d.content,
        d.address,
        d.phone,
        d.is_delete,
        d.shop_id,
        d.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION delete_depot (
    p_id UUID,
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
    shop_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
BEGIN
    -- 1. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = p_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 2. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Update depot
    RETURN QUERY
    UPDATE depot d
    SET d.is_delete = TRUE
    WHERE d.id = p_id
      AND d.is_delete = FALSE
    RETURNING
        d.id,
        d.name,
        d.description,
        d.content,
        d.address,
        d.phone,
        d.is_delete,
        d.shop_id,
        d.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION edit_store (
    p_id UUID,
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_account_id UUID
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
DECLARE
    v_shop_id UUID;
	v_depot_id UUID;
BEGIN
	-- 1. Lấy depot_id của store
    SELECT s.depot_id
    INTO v_depot_id
    FROM store s
    WHERE s.id = p_id
      AND s.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_depot_id IS NULL THEN
        RAISE EXCEPTION 'Store không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;
	
    -- 2. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = v_depot_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- 3. Update store
    RETURN QUERY
    UPDATE store s
    SET
        name = p_name,
        description = p_description,
        content = p_content
    WHERE s.id = p_id
      AND s.is_delete = FALSE
    RETURNING
        s.id,
        s.name,
        s.description,
        s.content,
        s.is_delete,
        s.depot_id,
        s.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION delete_store (
    p_id UUID,
    p_account_id UUID
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
DECLARE
    v_shop_id UUID;
	v_depot_id UUID;
BEGIN
	-- 1. Lấy depot_id của store
    SELECT s.depot_id
    INTO v_depot_id
    FROM store s
    WHERE s.id = p_id
      AND s.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_depot_id IS NULL THEN
        RAISE EXCEPTION 'Store không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;
	
    -- 2. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = v_depot_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- 3. Update store
    RETURN QUERY
    UPDATE store s
    SET is_delete = TRUE
    WHERE s.id = p_id
      AND s.is_delete = FALSE
    RETURNING
        s.id,
        s.name,
        s.description,
        s.content,
        s.is_delete,
        s.depot_id,
        s.create_time;
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