CREATE OR REPLACE FUNCTION .(
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_address VARCHAR(255),
    p_phone VARCHAR(255),
    p_account_id UUID
)
RETURNS shop
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop shop;
BEGIN
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
    RETURNING *
    INTO v_shop;

    RETURN v_shop;
END;
$$;