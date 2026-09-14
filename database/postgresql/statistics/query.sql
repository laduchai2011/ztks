CREATE OR REPLACE FUNCTION get_statistics_oa (
    p_from_date DATE,
    p_to_date DATE,
    p_zalo_oa_id UUID
)
RETURNS SETOF statistics_oa
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM statistics_oa
    WHERE of_day >= p_from_date
      AND of_day <= p_to_date
      AND zalo_oa_id = p_zalo_oa_id
    ORDER BY of_day;
END;
$$;