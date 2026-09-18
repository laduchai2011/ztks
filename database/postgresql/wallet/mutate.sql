CREATE OR REPLACE FUNCTION pay_order (
    p_wallet_id UUID,
    p_added_amount DECIMAL(20,2),
    p_order_id UUID,
    p_pay_hook_id UUID
)
RETURNS TABLE (
    order_data JSONB,
    statistics_data JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_voucher_id UUID;
    v_is_used BOOLEAN;
    v_time_expire TIMESTAMPTZ;
    v_money_voucher DECIMAL(20,2);

    v_money_order DECIMAL(20,2);

    v_chat_room_id UUID;
    v_zalo_oa_id UUID;
    v_account_id UUID;

    v_update_time TIMESTAMPTZ;

    v_order_data JSONB;
BEGIN

    /*
     * 1. Thanh toán đơn hàng
     */
    UPDATE orderr
    SET is_pay = TRUE
    WHERE id = p_order_id
      AND is_delete = FALSE
      AND is_pay = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Đơn hàng đã thanh toán hoặc không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    /*
     * 2. Kiểm tra voucher
     */
    SELECT
        id,
        is_used,
        time_expire,
        money
    INTO
        v_voucher_id,
        v_is_used,
        v_time_expire,
        v_money_voucher
    FROM voucher
    WHERE order_id = p_order_id
    LIMIT 1;

    IF v_is_used = TRUE THEN
        RAISE EXCEPTION 'Voucher đã được sử dụng.'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_time_expire IS NOT NULL
       AND v_time_expire < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Voucher đã hết hạn.'
            USING ERRCODE = 'P0003';
    END IF;

    /*
     * 3. Kiểm tra tiền đơn hàng
     */
    SELECT money
    INTO v_money_order
    FROM orderr
    WHERE id = p_order_id;

    IF v_money_order IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy tiền trong đơn hàng.'
            USING ERRCODE = 'P0004';
    END IF;

    IF v_money_order >
       p_added_amount + COALESCE(v_money_voucher, 0) THEN

        RAISE EXCEPTION 'Tiền chuyển vào không đủ.'
            USING ERRCODE = 'P0005';
    END IF;

    /*
     * 4. Cộng tiền chuyển khoản vào wallet
     */
    UPDATE wallet
    SET
        amount = amount + p_added_amount,
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_wallet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật ví không thành công.'
            USING ERRCODE = 'P0006';
    END IF;

    /*
     * 5. Ghi biến động số dư - tiền thanh toán
     */
    INSERT INTO balance_fluctuation (
        amount,
        type,
        pay_hook_id,
        voucher_id,
        order_id,
        wallet_id,
        create_time
    )
    VALUES (
        p_added_amount,
        'payOrder',
        p_pay_hook_id,
        NULL,
        p_order_id,
        p_wallet_id,
        CURRENT_TIMESTAMP
    );

    /*
     * 6. Xử lý voucher
     */
    IF v_voucher_id IS NOT NULL THEN

        UPDATE voucher
        SET is_used = TRUE
        WHERE id = v_voucher_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION
                'Cập nhật trạng thái sử dụng voucher không thành công.'
                USING ERRCODE = 'P0007';
        END IF;

        /*
         * Cộng tiền voucher vào wallet
         */
        UPDATE wallet
        SET
            amount = amount + v_money_voucher,
            update_time = CURRENT_TIMESTAMP
        WHERE id = p_wallet_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION
                'Hoàn tiền từ voucher tới ví không thành công.'
                USING ERRCODE = 'P0008';
        END IF;

        /*
         * Ghi biến động voucher
         */
        INSERT INTO balance_fluctuation (
            amount,
            type,
            pay_hook_id,
            voucher_id,
            order_id,
            wallet_id,
            create_time
        )
        VALUES (
            v_money_voucher,
            'voucher',
            NULL,
            v_voucher_id,
            NULL,
            p_wallet_id,
            CURRENT_TIMESTAMP
        );

    END IF;

    /*
     * 7. Trừ phí dịch vụ 1%
     */
    v_update_time := CURRENT_TIMESTAMP;

    UPDATE wallet
    SET
        amount =
            amount -
            (p_added_amount + COALESCE(v_money_voucher, 0)) * 0.01,
        update_time = v_update_time
    WHERE id = p_wallet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Cập nhật ví khấu trừ phí không thành công.'
            USING ERRCODE = 'P0009';
    END IF;

    /*
     * 8. Ghi biến động phí
     */
    INSERT INTO balance_fluctuation (
        amount,
        type,
        pay_hook_id,
        voucher_id,
        order_id,
        wallet_id,
        create_time
    )
    VALUES (
        -(
            p_added_amount +
            COALESCE(v_money_voucher, 0)
        ) * 0.01,
        'cost1%',
        NULL,
        NULL,
        NULL,
        p_wallet_id,
        CURRENT_TIMESTAMP
    );

    /*
     * 9. Lấy chatRoomId
     */
    SELECT chat_room_id
    INTO v_chat_room_id
    FROM orderr
    WHERE id = p_order_id;

    IF v_chat_room_id IS NULL THEN
        RAISE EXCEPTION
            'Không tìm thấy chatRoomId trong đơn hàng.'
            USING ERRCODE = 'P0010';
    END IF;

    /*
     * 10. Lấy zaloOaId + accountId
     */
    SELECT
        zalo_oa_id,
        account_id
    INTO
        v_zalo_oa_id,
        v_account_id
    FROM chat_room
    WHERE id = v_chat_room_id;

    IF v_zalo_oa_id IS NULL THEN
        RAISE EXCEPTION
            'Không tìm thấy zaloOaId trong đơn hàng.'
            USING ERRCODE = 'P0011';
    END IF;

    IF v_account_id IS NULL THEN
        RAISE EXCEPTION
            'Không tìm thấy accountId trong đơn hàng.'
            USING ERRCODE = 'P0012';
    END IF;

    /*
     * 11. Lấy order sau khi thanh toán
     */
    SELECT to_jsonb(o)
    INTO v_order_data
    FROM orderr o
    WHERE o.id = p_order_id;

    /*
     * 12. Trả kết quả
     */
    RETURN QUERY
    SELECT
        v_order_data,
        jsonb_build_object(
            'sales', p_added_amount,
            'zalo_oa_id', v_zalo_oa_id,
            'account_id', v_account_id,
            'of_day', v_update_time
        );

END;
$$;

CREATE OR REPLACE FUNCTION pay_agent_from_wallet (
    p_wallet_id UUID,
    p_agent_pay_id UUID,
    p_account_id UUID
)
RETURNS SETOF wallet
LANGUAGE plpgsql
AS $$
DECLARE
    v_agent_id UUID;
BEGIN

    /*
     * 1. Đánh dấu AgentPay đã thanh toán
     */
    UPDATE agent_pay
    SET is_pay = TRUE
    WHERE id = p_agent_pay_id
      AND is_pay = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật Agent-Pay thất bại.'
            USING ERRCODE = 'P0001';
    END IF;

    /*
     * 2. Trừ 50.000 khỏi wallet
     *
     * Điều kiện amount >= 50000 giúp tránh âm tiền.
     */
    UPDATE wallet
    SET
        amount = amount - 50000,
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_wallet_id
      AND amount >= 50000
      AND account_id = p_account_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tiền không đủ.'
            USING ERRCODE = 'P0002';
    END IF;

    /*
     * 3. Ghi biến động số dư
     */
    INSERT INTO balance_fluctuation (
        amount,
        type,
        pay_hook_id,
        wallet_id,
        create_time
    )
    VALUES (
        -50000,
        'payAgent',
        NULL,
        p_wallet_id,
        CURRENT_TIMESTAMP
    );

    /*
     * 4. Lấy agentId
     */
    SELECT agent_id
    INTO v_agent_id
    FROM agent_pay
    WHERE id = p_agent_pay_id;

    IF v_agent_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm agentId.'
            USING ERRCODE = 'P0003';
    END IF;

    /*
     * 5. Gia hạn Agent thêm 1 tháng
     */
    UPDATE agent
    SET
        expiry = CURRENT_TIMESTAMP + INTERVAL '1 month',
        type = 'upgrade'
    WHERE id = v_agent_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật Agent thất bại.'
            USING ERRCODE = 'P0004';
    END IF;

    /*
     * 6. Trả về wallet
     */
    RETURN QUERY
    SELECT *
    FROM wallet
    WHERE id = p_wallet_id;

END;
$$;

CREATE OR REPLACE FUNCTION create_require_take_money (
    p_amount DECIMAL(20,2),
    p_bank_id UUID,
    p_wallet_id UUID,
    p_account_id UUID
)
RETURNS SETOF require_take_money
LANGUAGE plpgsql
AS $$
DECLARE
    v_money_amount DECIMAL(20,2);
    v_new_id UUID;
    v_cost_take_money DECIMAL(20,2) := 5000;
BEGIN
    -- Kiểm tra ngân hàng thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM bank
        WHERE id = p_bank_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Ngân hàng này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra ví thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM wallet
        WHERE id = p_wallet_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Ví này không phải của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Không cho rút từ ví type = '1'
    IF EXISTS (
        SELECT 1
        FROM wallet
        WHERE id = p_wallet_id
          AND type = '1'
    ) THEN
        RAISE EXCEPTION 'Không thể rút tiền từ ví 1.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Không cho tạo request mới nếu đã có request đang xử lý
    IF EXISTS (
        SELECT 1
        FROM require_take_money
        WHERE wallet_id = p_wallet_id
          AND account_id = p_account_id
          AND is_do = FALSE
          AND is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Đã tồn tại 1 yêu cầu rút tiền, không thể tạo thêm yêu cầu mới.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Lấy số tiền trong ví
    SELECT amount
    INTO v_money_amount
    FROM wallet
    WHERE id = p_wallet_id;

    IF v_money_amount IS NULL THEN
        RAISE EXCEPTION 'Ví không tồn tại.'
            USING ERRCODE = 'P0005';
    END IF;

    -- Kiểm tra số dư
    IF p_amount > v_money_amount THEN
        RAISE EXCEPTION 'Tiền không đủ.'
            USING ERRCODE = 'P0006';
    END IF;

    -- Kiểm tra số tiền tối thiểu
    IF p_amount < v_cost_take_money THEN
        RAISE EXCEPTION 'Tiền yêu cầu quá nhỏ.'
            USING ERRCODE = 'P0007';
    END IF;

    -- Tạo yêu cầu rút tiền
    INSERT INTO require_take_money (
        amount,
        bank_id,
        wallet_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_amount,
        p_bank_id,
        p_wallet_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_id;

    -- Giữ nguyên cấu trúc trả về như SQL Server
    RETURN QUERY
    SELECT *
    FROM require_take_money
    WHERE id = v_new_id;

END;
$$;

CREATE OR REPLACE FUNCTION edit_require_take_money (
    p_require_take_money_id UUID,
    p_amount DECIMAL(20,2),
    p_bank_id UUID,
    p_wallet_id UUID,
    p_account_id UUID
)
RETURNS SETOF require_take_money
LANGUAGE plpgsql
AS $$
DECLARE
    v_member_ztks_id UUID;
    v_money_amount DECIMAL(20,2);
    v_cost_take_money DECIMAL(20,2) := 5000;
BEGIN

    -- Kiểm tra yêu cầu rút tiền
    IF NOT EXISTS (
        SELECT 1
        FROM require_take_money
        WHERE id = p_require_take_money_id
          AND account_id = p_account_id
          AND is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Yêu cầu rút tiền này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra yêu cầu đã được xác nhận chưa
    SELECT member_ztks_id
    INTO v_member_ztks_id
    FROM require_take_money
    WHERE id = p_require_take_money_id;

    IF v_member_ztks_id IS NOT NULL THEN
        RAISE EXCEPTION 'Yêu cầu rút tiền này đã được xác nhận nên không thể chỉnh sửa.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra ngân hàng thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM bank
        WHERE id = p_bank_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Ngân hàng này không phải của bạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Kiểm tra ví thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM wallet
        WHERE id = p_wallet_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Ví này không phải của bạn.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Không cho rút từ ví type = '1'
    IF EXISTS (
        SELECT 1
        FROM wallet
        WHERE id = p_wallet_id
          AND type = '1'
    ) THEN
        RAISE EXCEPTION 'Không thể rút tiền từ ví 1.'
            USING ERRCODE = 'P0005';
    END IF;

    -- Lấy số dư ví
    SELECT amount
    INTO v_money_amount
    FROM wallet
    WHERE id = p_wallet_id;

    IF v_money_amount IS NULL THEN
        RAISE EXCEPTION 'Ví không tồn tại.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Kiểm tra tiền
    IF p_amount > v_money_amount THEN
        RAISE EXCEPTION 'Tiền không đủ.'
            USING ERRCODE = 'P0006';
    END IF;

    -- Số tiền rút tối thiểu
    IF p_amount < v_cost_take_money THEN
        RAISE EXCEPTION 'Tiền yêu cầu quá nhỏ.'
            USING ERRCODE = 'P0007';
    END IF;

    -- Cập nhật yêu cầu
    UPDATE require_take_money
    SET
        amount = p_amount,
        bankId = p_bank_id
    WHERE id = p_require_take_money_id
      AND member_ztks_id IS NULL
      AND is_delete = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật yêu cầu rút tiền thất bại.'
            USING ERRCODE = 'P0008';
    END IF;

    -- Trả về record sau khi cập nhật
    RETURN QUERY
    SELECT *
    FROM require_take_money
    WHERE id = p_require_take_money_id;

END;
$$;

CREATE OR REPLACE FUNCTION delete_require_take_money (
    p_require_take_money_id UUID,
    p_account_id UUID
)
RETURNS SETOF require_take_money
LANGUAGE plpgsql
AS $$
DECLARE
    v_member_ztks_id UUID;
BEGIN

    -- Kiểm tra yêu cầu rút tiền thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM require_take_money
        WHERE id = p_require_take_money_id
          AND account_id = p_account_id
          AND is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Yêu cầu rút tiền này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra đã được xác nhận chưa
    SELECT member_ztks_id
    INTO v_member_ztks_id
    FROM require_take_money
    WHERE id = p_require_take_money_id;

    IF v_member_ztks_id IS NOT NULL THEN
        RAISE EXCEPTION 'Không thể xóa yêu cầu rút tiền khi đã được xác nhận.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Xóa mềm
    UPDATE require_take_money
    SET is_delete = TRUE
    WHERE id = p_require_take_money_id
      AND member_ztks_id IS NULL
      AND is_delete = FALSE;

    -- PostgreSQL tương đương @@ROWCOUNT = 0
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Huỷ yêu cầu rút tiền không thành công.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Trả về dữ liệu sau khi xóa mềm
    RETURN QUERY
    SELECT *
    FROM require_take_money
    WHERE id = p_require_take_money_id;

END;
$$;

CREATE OR REPLACE FUNCTION member_ztks_confirm_take_money (
    p_require_take_money_id UUID,
    p_member_ztks_id UUID
)
RETURNS SETOF require_take_money
LANGUAGE plpgsql
AS $$
BEGIN

    -- Kiểm tra memberZtks tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_member_ztks_id
          AND account_type = 'memberZtks'
    ) THEN
        RAISE EXCEPTION 'Không tồn tại memberZtks này.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Xác nhận yêu cầu rút tiền
    UPDATE require_take_money
    SET member_ztks_id = p_member_ztks_id
    WHERE id = p_require_take_money_id
      AND is_delete = FALSE
      AND member_ztks_id IS NULL;

    -- PostgreSQL tương đương @@ROWCOUNT = 0
    IF NOT FOUND THEN
        RAISE EXCEPTION 'MemberZtks xác nhận yêu cầu KHÔNG thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về yêu cầu sau khi xác nhận
    RETURN QUERY
    SELECT *
    FROM require_take_money
    WHERE id = p_require_take_money_id;

END;
$$;

CREATE OR REPLACE PROCEDURE take_money (
    IN p_amount DECIMAL(20,2),
    IN p_bank_id UUID,
    IN p_pay_hook_id UUID,
    IN p_require_take_money_id UUID,
    IN p_wallet_id UUID,
    IN p_account_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_cost_take_money5 INT := 5000;
BEGIN
    -- Kiểm tra yêu cầu rút tiền
    IF NOT EXISTS (
        SELECT 1
        FROM require_take_money
        WHERE id = p_require_take_money_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5001',
            MESSAGE = 'Yêu cầu rút tiền này không phải của bạn .';
    END IF;

    -- Kiểm tra ngân hàng
    IF NOT EXISTS (
        SELECT 1
        FROM bank
        WHERE id = p_bank_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5002',
            MESSAGE = 'Ngân hàng này không phải của bạn .';
    END IF;

    -- Kiểm tra ví
    IF NOT EXISTS (
        SELECT 1
        FROM wallet
        WHERE id = p_wallet_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5003',
            MESSAGE = 'Ví này không phải của bạn .';
    END IF;

    -- Kiểm tra yêu cầu đã bị xóa
    IF EXISTS (
        SELECT 1
        FROM require_take_money
        WHERE id = p_require_take_money_id
          AND account_id = p_account_id
          AND is_delete = TRUE
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5004',
            MESSAGE = 'Yêu cầu rút tiền này đã bị xóa .';
    END IF;

    -- Trừ tiền rút khỏi ví
    UPDATE wallet
    SET
        amount = amount - p_amount,
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_wallet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5005',
            MESSAGE = 'Cập nhật tiền ra khỏi ví không thành công.';
    END IF;

    -- Ghi nhận biến động số dư
    INSERT INTO balance_fluctuation (
        amount,
        type,
        pay_hook_id,
        require_take_money_id,
        wallet_id,
        create_time
    )
    VALUES (
        -p_amount,
        'takeMoney',
        p_pay_hook_id,
        p_require_take_money_id,
        p_wallet_id,
        CURRENT_TIMESTAMP
    );

    -- Trừ phí rút tiền 5000
    UPDATE wallet
    SET
        amount = amount - v_cost_take_money5,
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_wallet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5007',
            MESSAGE = 'Cập nhật khấu trừ phí rút tiền không thành công.';
    END IF;

    -- Ghi nhận phí rút tiền
    INSERT INTO balance_fluctuation (
        amount,
        type,
        wallet_id,
        create_time
    )
    VALUES (
        -v_cost_take_money5,
        'costTakeMoney5',
        p_wallet_id,
        CURRENT_TIMESTAMP
    );

    -- Hoàn tất yêu cầu rút tiền
    UPDATE require_take_money
    SET
        is_do = TRUE,
        do_time = CURRENT_TIMESTAMP
    WHERE id = p_require_take_money_id
      AND is_delete = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5009',
            MESSAGE = 'Cập nhật yêu cầu rút tiền thất bại.';
    END IF;

    -- PostgreSQL procedure không trả result set bằng SELECT như SQL Server.
    -- Nếu cần trả wallet về Node.js, nên dùng FUNCTION.
END;
$$;