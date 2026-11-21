CREATE OR REPLACE FUNCTION get_product_code_by_id (
    p_id UUID
)
RETURNS SETOF product_code
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT pc.*
    FROM product_code pc
    WHERE pc.id = p_id
      AND pc.is_delete = FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION get_product_code_total (
    p_admin_account_id UUID
)
RETURNS SETOF product_code_total
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT pct.*
    FROM product_code_total pct
    WHERE pct.admin_account_id = p_admin_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_product_total (
    p_admin_account_id UUID
)
RETURNS SETOF product_total
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT pt.*
    FROM product_total pt
    WHERE pt.admin_account_id = p_admin_account_id;
END;
$$;