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