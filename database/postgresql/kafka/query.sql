CREATE OR REPLACE FUNCTION signin_customer(
    p_phone VARCHAR(255),
    p_password VARCHAR(255)
)
RETURNS SETOF customer
LANGUAGE sql
AS $$
    SELECT *
    FROM customer
    WHERE phone = p_phone
      AND password = p_password;
$$;

CREATE OR REPLACE FUNCTION customer_get_me(
    p_id UUID
)
RETURNS SETOF customer
LANGUAGE sql
AS $$
    SELECT *
    FROM customer
    WHERE id = p_id;
$$;