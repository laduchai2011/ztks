CREATE OR REPLACE FUNCTION get_bank_with_id (
    p_id UUID
)
RETURNS SETOF bank
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM bank
    WHERE id = p_id
      AND is_delete = FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION get_all_banks (
    p_account_id UUID
)
RETURNS SETOF bank
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM bank
    WHERE account_id = p_account_id
      AND is_delete = FALSE;
END;
$$;