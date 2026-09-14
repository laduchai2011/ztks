CREATE OR REPLACE FUNCTION create_voucher (
    p_day_amount INT,
    p_money DECIMAL(20,2),
    p_phone VARCHAR(255),
    p_member_ztks_id UUID
)
RETURNS SETOF voucher
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_voucher_id UUID;
BEGIN
    -- Kiểm tra tài khoản có phải memberZtks không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_member_ztks_id
          AND account_type = 'memberZtks'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản memberZtks.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo voucher
    INSERT INTO voucher (
        is_used,
        time_expire,
        money,
        order_id,
        member_ztks_id,
        phone,
        update_time,
        create_time
    )
    VALUES (
        FALSE,
        CURRENT_TIMESTAMP + (p_day_amount * INTERVAL '1 day'),
        p_money,
        NULL,
        p_member_ztks_id,
        p_phone,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_voucher_id;

    -- Trả về voucher vừa tạo
    RETURN QUERY
    SELECT *
    FROM voucher
    WHERE id = v_new_voucher_id;
END;
$$;

CREATE OR REPLACE FUNCTION customer_use_voucher (
    p_order_id UUID,
    p_voucher_id UUID,
    p_customer_id UUID
)
RETURNS SETOF voucher
LANGUAGE plpgsql
AS $$
DECLARE
    v_is_pay BOOLEAN;

    v_is_used BOOLEAN;
    v_time_expire TIMESTAMPTZ;
    v_money_new_voucher DECIMAL(20,2);

    v_customer_phone VARCHAR(255);

    v_phone_order VARCHAR(255);
    v_phone_voucher VARCHAR(255);

    v_selected_voucher_id UUID;
    v_money_selected_voucher DECIMAL(20,2);
BEGIN
    -- Kiểm tra đơn hàng đã thanh toán hay chưa
    SELECT o.is_pay
    INTO v_is_pay
    FROM orderr o
    WHERE o.id = p_order_id;

    IF v_is_pay = TRUE THEN
        RAISE EXCEPTION 'Đơn hàng đã thanh toán không thể thay đổi.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra voucher đã dùng hay chưa, đã hết hạn chưa
    SELECT
        v.is_used,
        v.time_expire,
        v.money
    INTO
        v_is_used,
        v_time_expire,
        v_money_new_voucher
    FROM voucher v
    WHERE v.id = p_voucher_id;

    IF v_is_used = TRUE THEN
        RAISE EXCEPTION 'Voucher đã được sử dụng.'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_time_expire < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Voucher đã hết hạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Lấy số điện thoại customer
    SELECT c.phone
    INTO v_customer_phone
    FROM customer c
    WHERE c.id = p_customer_id;

    IF v_customer_phone IS NULL THEN
        RAISE EXCEPTION 'Tài khoản không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra voucher thuộc customer
    IF NOT EXISTS (
        SELECT 1
        FROM voucher v
        WHERE v.id = p_voucher_id
          AND v.phone = v_customer_phone
    ) THEN
        RAISE EXCEPTION 'Voucher này không phải của bạn.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Lấy phone của order
    SELECT o.phone
    INTO v_phone_order
    FROM orderr o
    WHERE o.id = p_order_id;

    IF v_phone_order IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy số điện thoại của đơn hàng.'
            USING ERRCODE = 'P0005';
    END IF;

    -- Lấy phone của voucher
    SELECT v.phone
    INTO v_phone_voucher
    FROM voucher v
    WHERE v.id = p_voucher_id;

    IF v_phone_voucher IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy số điện thoại của voucher.'
            USING ERRCODE = 'P0006';
    END IF;

    -- So sánh 2 số điện thoại
    IF v_phone_order <> v_phone_voucher THEN
        RAISE EXCEPTION 'Số điện thoại của voucher không khớp với đơn hàng.'
            USING ERRCODE = 'P0007';
    END IF;

    -- Tìm voucher hiện tại của order
    SELECT
        v.id,
        v.money
    INTO
        v_selected_voucher_id,
        v_money_selected_voucher
    FROM voucher v
    WHERE v.order_id = p_order_id
    LIMIT 1;

    -- Bỏ voucher cũ
    IF v_selected_voucher_id IS NOT NULL THEN

        UPDATE voucher
        SET order_id = NULL
        WHERE id = v_selected_voucher_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Bỏ chọn voucher cũ không thành công.'
                USING ERRCODE = 'P0008';
        END IF;

    END IF;

    -- Gán voucher mới cho order
    UPDATE voucher
    SET order_id = p_order_id
    WHERE id = p_voucher_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật voucher cho đơn hàng không thành công.'
            USING ERRCODE = 'P0009';
    END IF;

    -- Giữ nguyên cấu trúc dữ liệu trả về
    RETURN QUERY
    SELECT *
    FROM voucher
    WHERE id = p_voucher_id;

END;
$$;