-- DROP FUNCTION IF EXISTS signup(
--     VARCHAR,
--     VARCHAR,
--     VARCHAR,
--     VARCHAR,
--     VARCHAR
-- );
CREATE OR REPLACE FUNCTION signup (
    p_user_name   VARCHAR(100),
    p_password   VARCHAR(100),
    p_phone      VARCHAR(15),
    p_first_name VARCHAR(20),
    p_last_name  VARCHAR(20)
)
RETURNS TABLE (
    id UUID,
    user_name VARCHAR(100),
    password VARCHAR(100),
    phone VARCHAR(15),
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    avatar VARCHAR(255),
    is_delete BOOLEAN,
    update_time TIMESTAMPTZ,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_account_id UUID;
    v_agent_code VARCHAR(255);
    v_password2 VARCHAR(255);
BEGIN

    -- 1. Tạo account
    INSERT INTO account (
        user_name,
        password,
        phone,
        first_name,
        last_name,
        avatar,
        update_time,
        create_time
    )
    VALUES (
        p_user_name,
        p_password,
        p_phone,
        p_first_name,
        p_last_name,
        NULL,
        NOW(),
        NOW()
    )
    RETURNING account.id INTO v_new_account_id;

    -- 2. Tạo mã giới thiệu
    INSERT INTO recommend (
        my_code,
        your_code,
        account_id
    )
    VALUES (
        LEFT(REPLACE(gen_random_uuid()::TEXT, '-', ''), 10),
        NULL,
        v_new_account_id
    );

    -- 3. Tạo wallet type 1
    INSERT INTO wallet (
        amount,
        type,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        0,
        '1',
        v_new_account_id,
        NOW(),
        NOW()
    );

    -- 4. Tạo wallet type 2
    INSERT INTO wallet (
        amount,
        type,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        0,
        '2',
        v_new_account_id,
        NOW(),
        NOW()
    );

    -- 5. Tạo callAgent
    v_agent_code := gen_random_uuid()::TEXT;
    v_password2 := gen_random_uuid()::TEXT;

    IF EXISTS (
        SELECT 1
        FROM call_agent
        WHERE account_id = v_new_account_id
    ) THEN
        RAISE EXCEPTION 'Đã tồn tại callAgent cho tài khoản này.'
            USING ERRCODE = 'P0001';
    END IF;

    INSERT INTO call_agent (
        agent_code,
        password,
        account_id
    )
    VALUES (
        v_agent_code,
        v_password2,
        v_new_account_id
    );

    -- 6. Trả account vừa tạo
    RETURN QUERY
    SELECT
        a.id,
        a.user_name,
        a.password,
        a.phone,
        a.first_name,
        a.last_name,
        a.avatar,
        a.is_delete,
        a.update_time,
        a.create_time
    FROM account a
    WHERE a.id = v_new_account_id;

END;
$$;

CREATE OR REPLACE FUNCTION edit_infor_account (
    p_id UUID,
    p_first_name VARCHAR(20),
    p_last_name VARCHAR(20),
    p_avatar VARCHAR(255) DEFAULT NULL
)
RETURNS account
LANGUAGE plpgsql
AS $$
DECLARE
    result account;
BEGIN
    UPDATE account
    SET
        first_name = p_first_name,
        last_name = p_last_name,
        avatar = COALESCE(p_avatar, avatar)
    WHERE id = p_id
    RETURNING * INTO result;

    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION forget_password (
    p_user_name VARCHAR(100),
    p_password VARCHAR(100),
    p_phone VARCHAR(15)
)
RETURNS SETOF account
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE account
    SET password = p_password
    WHERE status = 'normal'
      AND user_name = p_user_name
      AND phone = p_phone
    RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION create_account_information (
    p_account_type VARCHAR(255),
    p_account_id UUID,
	p_added_by_id UUID DEFAULT NULL
)
RETURNS SETOF account_information
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO account_information (
        added_by_id,
        account_type,
        account_id
    )
    VALUES (
        p_added_by_id,
        p_account_type,
        p_account_id
    );

    RETURN QUERY
    SELECT *
    FROM account_information
    WHERE account_id = p_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION add_member_v1 (
    p_added_by_id UUID,
    p_account_id UUID
)
RETURNS SETOF account_information
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_added_by_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin.'
            USING ERRCODE = 'P0001';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Thành viên thêm vào không được là 1 tài khoản admin.'
            USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO statistics_member_in_one_month (
        sales,
        order_amount,
        flag,
        of_month,
        zalo_oa_id,
        account_id,
        create_time
    )
    SELECT
        0,
        0,
        'new',
        date_trunc('month', CURRENT_DATE)::date,
        z.id,
        p_account_id,
        CURRENT_TIMESTAMP
    FROM zalo_oa z
    WHERE z.account_id = p_added_by_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tạo statistics_member_in_one_month không thành công.'
            USING ERRCODE = 'P0003';
    END IF;

    UPDATE account_information
    SET added_by_id = p_added_by_id
    WHERE account_id = p_account_id
      AND added_by_id IS NULL;

    IF NOT FOUND THEN
        IF NOT EXISTS (
            SELECT 1
            FROM account_information
            WHERE account_id = p_account_id
        ) THEN
            INSERT INTO account_information (
                added_by_id,
                account_type,
                account_id
            )
            VALUES (
                p_added_by_id,
                'member',
                p_account_id
            );
        END IF;
    END IF;

    RETURN QUERY
    SELECT *
    FROM account_information
    WHERE account_id = p_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION leave_all_account_receive_message (
    p_account_id UUID
)
RETURNS TABLE (
    success BOOLEAN,
    failure BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE account_receive_message
    SET account_id_receive_message = NULL
    WHERE account_id_receive_message = p_account_id;

    IF NOT EXISTS (
        SELECT 1
        FROM account_receive_message
        WHERE account_id_receive_message = p_account_id
    ) THEN
        RETURN QUERY
        SELECT TRUE, FALSE;
    ELSE
        RETURN QUERY
        SELECT FALSE, TRUE;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

CREATE OR REPLACE FUNCTION leave_admin (
    p_account_id UUID
)
RETURNS TABLE (
    success BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN

    -- 1. Không cho admin rời
    IF EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5001',
            MESSAGE = 'Tài khoản admin không thể thực hiện việc này.';
    END IF;

    -- 2. Kiểm tra quyền nhận tin nhắn
    IF EXISTS (
        SELECT 1
        FROM account_receive_message
        WHERE account_id_receive_message = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5002',
            MESSAGE = 'Bạn không thể rời đi khi vẫn tồn tại trong 1 quyền nhận tin nhắn.';
    END IF;

    -- 3. Kiểm tra chatSession
    IF EXISTS (
        SELECT 1
        FROM chat_session
        WHERE selected_account_id = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5003',
            MESSAGE = 'Bạn không thể rời đi khi vẫn tồn tại trong 1 quyền nhận tin nhắn, chatSession cũng có quyền nhận tin nên bạn phải ra khỏi đó trước.';
    END IF;

    -- 4. Kiểm tra chatRoom
    IF EXISTS (
        SELECT 1
        FROM chat_room
        WHERE account_id = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5004',
            MESSAGE = 'Bạn không thể rời đi khi vẫn tồn tại phòng hội thoại.';
    END IF;

    -- 5. Cập nhật statistics
    UPDATE statistics_member_in_one_month
    SET flag = 'old'
    WHERE account_id = p_account_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5005',
            MESSAGE = 'Cập nhật statisticsMemberInOneMonth không thành công.';
    END IF;

    -- 6. Xóa người thêm account
    UPDATE account_information
    SET added_by_id = NULL
    WHERE account_id = p_account_id;

    -- 7. Kiểm tra kết quả
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND added_by_id IS NOT NULL
    ) THEN
        RETURN QUERY
        SELECT TRUE;

        RETURN;
    END IF;

    RETURN QUERY
    SELECT FALSE;

END;
$$;

CREATE OR REPLACE FUNCTION create_reply_account (
    p_authorized_account_id VARCHAR(255),
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS SETOF account
LANGUAGE plpgsql
AS $$
BEGIN

    -- 1. Kiểm tra 2 account có cùng người quản lý
    IF NOT EXISTS (
        SELECT 1
        FROM account_information ai1
        INNER JOIN account_information ai2
            ON ai1.added_by_id = ai2.added_by_id
        WHERE ai1.account_id = p_account_id
          AND ai2.account_id = p_authorized_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5001',
            MESSAGE = 'Không chung người quản lý.';
    END IF;

    -- 2. Kiểm tra chatRoom có tồn tại và thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE id = p_chat_room_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5002',
            MESSAGE = 'ChatRoom không tồn tại hoặc đã bị khóa.';
    END IF;

    -- 3. Kiểm tra role đã tồn tại chưa
    IF EXISTS (
        SELECT 1
        FROM chat_room_role
        WHERE chat_room_id = p_chat_room_id
          AND authorized_account_id = p_authorized_account_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5003',
            MESSAGE = 'Role này đã tồn tại trong chatRoom.';
    END IF;

    -- 4. Tạo chatRoomRole
    INSERT INTO chat_room_role (
        authorized_account_id,
        is_read,
        is_send,
        status,
        chat_room_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_authorized_account_id,
        TRUE,
        FALSE,
        'normal',
        p_chat_room_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- 5. Trả về account vừa được authorize
    RETURN QUERY
    SELECT a.*
    FROM account a
    WHERE a.status = 'normal'
      AND a.id = p_authorized_account_id;

END;
$$;

CREATE OR REPLACE FUNCTION create_account_receive_message (
    p_zalo_oa_id UUID,
    p_account_id UUID,
	p_account_id_receive_message UUID DEFAULT NULL
)
RETURNS SETOF account_receive_message
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
BEGIN

    -- 1. Lấy người quản lý của account
    SELECT added_by_id
    INTO v_added_by_id
    FROM account_information
    WHERE account_id = p_account_id;

    -- 2. Phải là thành viên mới được thực hiện
    IF v_added_by_id IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5001',
            MESSAGE = 'Account này không có quyền thực hiện thao tác.';
    END IF;


    -- 3. Kiểm tra account có quyền trên Zalo OA này không
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE id = p_zalo_oa_id
          AND account_id = v_added_by_id
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P5002',
            MESSAGE = 'Bạn không có quyền trên zaloOa này.';
    END IF;

    -- 4. Thêm accountReceiveMessage
    INSERT INTO account_receive_message (
        account_id_receive_message,
        zalo_oa_id,
        account_id
    )
    VALUES (
        p_account_id_receive_message,
        p_zalo_oa_id,
        p_account_id
    );

    -- 5. Trả về các record của account + Zalo OA
    RETURN QUERY
    SELECT *
    FROM account_receive_message
    WHERE account_id = p_account_id
      AND zalo_oa_id = p_zalo_oa_id;

END;
$$;

CREATE OR REPLACE FUNCTION update_account_receive_message (
    p_zalo_oa_id UUID,
    p_account_id UUID,
	p_account_id_receive_message UUID DEFAULT NULL
)
RETURNS SETOF account_receive_message
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
BEGIN
    -- Phải là thành viên mới thực hiện được
    SELECT added_by_id
    INTO v_added_by_id
    FROM account_information
    WHERE account_id = p_account_id;

    IF v_added_by_id IS NULL THEN
        RAISE EXCEPTION 'Account này không có quyền thực hiện thao tác.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Đảm bảo thực hiện đúng OA mà bạn có quyền
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE id = p_zalo_oa_id
          AND account_id = v_added_by_id
    ) THEN
        RAISE EXCEPTION 'Bạn không có quyền trên zaloOa này.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Cập nhật
    UPDATE account_receive_message
    SET account_id_receive_message = p_account_id_receive_message
    WHERE account_id = p_account_id
      AND zalo_oa_id = p_zalo_oa_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật accountReceiveMessage không thành công.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Trả về record vừa cập nhật
    RETURN QUERY
    SELECT *
    FROM account_receive_message
    WHERE account_id = p_account_id
      AND zalo_oa_id = p_zalo_oa_id;
END;
$$;

CREATE OR REPLACE FUNCTION add_your_recommend(
    p_your_code VARCHAR(255),
    p_account_id UUID
)
RETURNS SETOF recommend
LANGUAGE plpgsql
AS $$
DECLARE
    v_your_account_id UUID;
    v_my_wallet_id UUID;
    v_your_wallet_id UUID;
BEGIN
    -- Kiểm tra mã giới thiệu có tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM recommend
        WHERE my_code = p_your_code
    ) THEN
        RAISE EXCEPTION 'Mã này không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Cập nhật mã người giới thiệu
    UPDATE recommend
    SET your_code = p_your_code
    WHERE account_id = p_account_id
      AND my_code <> p_your_code
      AND your_code IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật mã giới thiệu không thành công'
            USING ERRCODE = 'P0002';
    END IF;

    -- Lấy accountId của người giới thiệu
    SELECT account_id
    INTO v_your_account_id
    FROM recommend
    WHERE my_code = p_your_code;

    -- Lấy ví của tôi
    SELECT id
    INTO v_my_wallet_id
    FROM wallet
    WHERE account_id = p_account_id
      AND type = '1';

    -- Lấy ví của người giới thiệu
    SELECT id
    INTO v_your_wallet_id
    FROM wallet
    WHERE account_id = v_your_account_id
      AND type = '1';

    IF v_my_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy ví của tôi'
            USING ERRCODE = 'P0003';
    END IF;

    IF v_your_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy ví người giới thiệu'
            USING ERRCODE = 'P0004';
    END IF;

    -- Cộng tiền cho tôi
    UPDATE wallet
    SET amount = amount + 25000,
        update_time = CURRENT_TIMESTAMP
    WHERE id = v_my_wallet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật ví của tôi không thành công'
            USING ERRCODE = 'P0005';
    END IF;

    -- Ghi biến động số dư của tôi
    INSERT INTO balance_fluctuation (
        amount,
        type,
        pay_hook_id,
        wallet_id,
        create_time
    )
    VALUES (
        25000,
        'recommend',
        NULL,
        v_my_wallet_id,
        CURRENT_TIMESTAMP
    );

    -- Cộng tiền cho người giới thiệu
    UPDATE wallet
    SET amount = amount + 25000,
        update_time = CURRENT_TIMESTAMP
    WHERE id = v_your_wallet_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật ví của người giới thiệu không thành công'
            USING ERRCODE = 'P0006';
    END IF;

    -- Ghi biến động số dư của người giới thiệu
    INSERT INTO balance_fluctuation (
        amount,
        type,
        pay_hook_id,
        wallet_id,
        create_time
    )
    VALUES (
        25000,
        'recommend',
        NULL,
        v_your_wallet_id,
        CURRENT_TIMESTAMP
    );

    -- Trả về recommend
    RETURN QUERY
    SELECT *
    FROM recommend
    WHERE account_id = p_account_id;
END;
$$;