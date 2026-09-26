CREATE OR REPLACE FUNCTION get_my_check_in_outs (
    p_from_date DATE,
    p_to_date DATE,
    p_account_id UUID
)
RETURNS TABLE (
    date DATE,
    id UUID,
    type VARCHAR(255),
    note VARCHAR(255),
    image VARCHAR(255),
    video VARCHAR(255),
    is_delete BOOLEAN,
    account_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_first_date DATE;
    v_to_date DATE;
BEGIN
    -- Ngày đầu tiên account có dữ liệu
    SELECT MIN(c.create_time)::DATE
    INTO v_first_date
    FROM check_in_out AS c
    WHERE c.account_id = p_account_id
      AND c.is_delete = FALSE;

    -- Không có dữ liệu
    IF v_first_date IS NULL THEN
        RETURN;
    END IF;

    -- Không lấy dữ liệu trước ngày đầu tiên
    IF p_to_date < v_first_date THEN
        v_to_date := v_first_date;
    ELSE
        v_to_date := p_to_date;
    END IF;

    RETURN QUERY
    SELECT
        d.date::DATE,
        c.id,
        c.type,
        c.note,
        c.image,
        c.video,
        c.is_delete,
        c.account_id,
        c.create_time
    FROM generate_series(
        p_from_date,
        v_to_date,
        INTERVAL '-1 day'
    ) AS d(date)

    LEFT JOIN check_in_out AS c
        ON c.account_id = p_account_id
        AND c.is_delete = FALSE
        AND c.create_time >= (
            d.date::TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh'
        )
        AND c.create_time < (
            (d.date + INTERVAL '1 day')::TIMESTAMP
                AT TIME ZONE 'Asia/Ho_Chi_Minh'
        )

    ORDER BY
        d.date DESC,
        c.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION get_check_in_outs_with_date (
    p_type VARCHAR(255),
    p_date DATE,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    type VARCHAR(255),
    note VARCHAR(255),
    image VARCHAR(255),
    video VARCHAR(255),
    is_delete BOOLEAN,
    account_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.type,
        c.note,
        c.image,
        c.video,
        c.is_delete,
        c.account_id,
        c.create_time
    FROM check_in_out AS c
    WHERE c.account_id = p_account_id
      AND c.type = p_type
      AND c.is_delete = FALSE
      AND c.create_time >= (
          p_date::TIMESTAMP AT TIME ZONE '+07:00'
      )
      AND c.create_time < (
          (p_date + 1)::TIMESTAMP AT TIME ZONE '+07:00'
      )
    ORDER BY c.create_time ASC;
END;
$$;

CREATE OR REPLACE FUNCTION get_check_in_out_inspect_with_fk (
    p_check_in_out_id UUID
)
RETURNS SETOF check_in_out_inspect
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM check_in_out_inspect
    WHERE check_in_out_id = p_check_in_out_id
      AND is_delete = FALSE;
END;
$$;