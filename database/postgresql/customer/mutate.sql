CREATE OR REPLACE FUNCTION create_customer (
    p_phone VARCHAR(255),
    p_password VARCHAR(255)
)
RETURNS SETOF customer
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO customer (
        phone,
        password,
        create_time
    )
    VALUES (
        p_phone,
        p_password,
        CURRENT_TIMESTAMP
    );

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Đăng ký tài khoản không thành công.';
    END IF;

    RETURN QUERY
    SELECT *
    FROM customer
    WHERE phone = p_phone;
END;
$$;

CREATE OR REPLACE FUNCTION customer_forget_password (
    p_phone VARCHAR(255),
    p_password VARCHAR(255)
)
RETURNS SETOF customer
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE customer
    SET password = p_password
    WHERE phone = p_phone;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật mật khẩu không thành công.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN QUERY
    SELECT *
    FROM customer
    WHERE phone = p_phone;
END;
$$;