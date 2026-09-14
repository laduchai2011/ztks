CREATE OR REPLACE FUNCTION update_statistics (
    p_sales DECIMAL(20,2),
    p_zalo_oa_id UUID,
    p_account_id UUID,
    p_of_day DATE
)
RETURNS SETOF statistics_oa
LANGUAGE plpgsql
AS $$
DECLARE
    v_of_month DATE;
BEGIN
    v_of_month := DATE_TRUNC('month', p_of_day)::DATE;

    -- Cập nhật statisticsOa
    UPDATE statistics_oa
    SET
        sales = sales + p_sales,
        order_amount = order_amount + 1
    WHERE zalo_oa_id = p_zalo_oa_id
      AND of_day = p_of_day;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật doanh số không thành công.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Cập nhật statistics_member_in_one_month
    IF EXISTS (
        SELECT 1
        FROM statistics_member_in_one_month
        WHERE account_id = p_account_id
          AND zalo_oa_id = p_zalo_oa_id
          AND of_month = v_of_month
          AND flag = 'new'
    ) THEN

        UPDATE statistics_member_in_one_month
        SET
            sales = sales + p_sales,
            order_amount = order_amount + 1
        WHERE account_id = p_account_id
          AND zalo_oa_id = p_zalo_oa_id
          AND of_month = v_of_month
          AND flag = 'new';

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Cập nhật doanh số không thành công.'
                USING ERRCODE = 'P0002';
        END IF;

    ELSE

        INSERT INTO statistics_member_in_one_month (
            sales,
            order_amount,
            flag,
            of_month,
            zalo_oa_id,
            account_id,
            create_time
        )
        VALUES (
            p_sales,
            1,
            'new',
            v_of_month,
            p_zalo_oa_id,
            p_account_id,
            CURRENT_TIMESTAMP
        );

    END IF;

    -- Giữ nguyên SELECT trả về như SQL Server
    RETURN QUERY
    SELECT *
    FROM statistics_oa
    WHERE zalo_oa_id = p_zalo_oa_id;

END;
$$;