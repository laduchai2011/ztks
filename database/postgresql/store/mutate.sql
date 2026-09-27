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
BEGIN
    RETURN QUERY
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
    RETURNING
        shop.id,
        shop.name,
        shop.description,
        shop.content,
        shop.address,
        shop.phone,
        shop.is_delete,
        shop.account_id,
        shop.create_time;
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