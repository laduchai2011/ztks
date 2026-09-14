CREATE OR REPLACE FUNCTION create_register_post (
    p_name VARCHAR(255),
    p_type VARCHAR(255),
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF register_post
LANGUAGE plpgsql
AS $$
DECLARE
    v_register_post_id UUID;
BEGIN
    -- Kiểm tra tài khoản có phải admin không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo register post
    INSERT INTO register_post (
        name,
        type,
        zalo_oa_id,
        account_id,
        create_time
    )
    VALUES (
        p_name,
        p_type,
        p_zalo_oa_id,
        p_account_id,
        NOW()
    )
    RETURNING id INTO v_register_post_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM register_post
    WHERE id = v_register_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION edit_register_post (
    p_id UUID,
    p_name VARCHAR(255),
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF register_post
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra bài đăng có thuộc tài khoản này không
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE account_id = p_account_id
          AND id = p_id
    ) THEN
        RAISE EXCEPTION 'Đăng ký bài viết này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Cập nhật
    UPDATE register_post
    SET
        name = p_name,
        zalo_oa_id = p_zalo_oa_id
    WHERE id = p_id
      AND is_delete = FALSE;

    -- Tương đương @@ROWCOUNT = 0
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật đăng ký bài viết không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về dữ liệu sau khi cập nhật
    RETURN QUERY
    SELECT *
    FROM register_post
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_register_post (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF register_post
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra bài đăng có thuộc tài khoản này không
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE account_id = p_account_id
          AND id = p_id
    ) THEN
        RAISE EXCEPTION 'Đăng ký bài viết này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Soft delete
    UPDATE register_post
    SET is_delete = TRUE
    WHERE id = p_id
      AND is_delete = FALSE;

    -- Tương đương @@ROWCOUNT = 0
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Xóa đăng ký bài viết không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về record sau khi xóa
    RETURN QUERY
    SELECT *
    FROM register_post
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_post (
    p_index INT,
    p_name VARCHAR(255),
    p_type VARCHAR(255),
    p_title VARCHAR(255),
    p_describe TEXT,
    p_images TEXT,
    p_is_active BOOLEAN,
    p_register_post_id UUID,
    p_account_id UUID
)
RETURNS SETOF post
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_type INT;
    v_new_post_id UUID;
BEGIN
    -- Kiểm tra registerPost có thuộc account này không
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE account_id = p_account_id
          AND id = p_register_post_id
    ) THEN
        RAISE EXCEPTION 'Đăng ký bài viết này không phải của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra registerPost đã bị xóa chưa
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE id = p_register_post_id
          AND is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Đăng ký bài viết này đã bị xóa.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra type của registerPost
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE id = p_register_post_id
          AND type = p_type
    ) THEN
        RAISE EXCEPTION 'Gói này đã hết hạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Đếm số bài viết theo type
    SELECT COUNT(*)
    INTO v_total_type
    FROM post
    WHERE type = p_type;

    -- Giới hạn free
    IF p_type = 'free' AND v_total_type > 10 THEN
        RAISE EXCEPTION 'Số lượng bài đăng miễn phí không được quá 10.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Giới hạn upgrade
    IF p_type = 'upgrade' AND v_total_type > 30 THEN
        RAISE EXCEPTION 'Số lượng bài đăng miễn phí không được quá 30.'
            USING ERRCODE = 'P0005';
    END IF;

    -- Tạo post
    INSERT INTO post (
        index,
        name,
        type,
        title,
        describe,
        images,
        is_active,
        register_post_id,
        create_time
    )
    VALUES (
        p_index,
        p_name,
        p_type,
        p_title,
        p_describe,
        p_images,
        p_is_active,
        p_register_post_id,
        NOW()
    )
    RETURNING id INTO v_new_post_id;

    -- Trả về post vừa tạo
    RETURN QUERY
    SELECT *
    FROM post
    WHERE id = v_new_post_id;
END;
$$;

CREATE OR REPLACE FUNCTION edit_post (
    p_id UUID,
    p_index INT,
    p_name VARCHAR(255),
    p_title VARCHAR(255),
    p_describe TEXT,
    p_images TEXT,
    p_is_active BOOLEAN,
    p_account_id UUID
)
RETURNS SETOF post
LANGUAGE plpgsql
AS $$
DECLARE
    v_register_post_id UUID;
    v_type VARCHAR(255);
BEGIN
    -- Lấy registerPostId và type của post
    SELECT
        register_post_id,
        type
    INTO
        v_register_post_id,
        v_type
    FROM post
    WHERE id = p_id;

    -- Không tìm thấy post / registerPostId
    IF v_register_post_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy registerPostId trong post.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Không tìm thấy type
    IF v_type IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy type trong post.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Kiểm tra registerPost có thuộc account này không
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE account_id = p_account_id
          AND id = v_register_post_id
    ) THEN
        RAISE EXCEPTION 'Đăng ký bài viết này không phải của bạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- Kiểm tra registerPost đã bị xóa chưa
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE id = v_register_post_id
          AND is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Đăng ký bài viết này đã bị xóa.'
            USING ERRCODE = 'P0004';
    END IF;

    -- Kiểm tra type của registerPost
    IF NOT EXISTS (
        SELECT 1
        FROM register_post
        WHERE id = v_register_post_id
          AND type = v_type
    ) THEN
        RAISE EXCEPTION 'Gói này đã hết hạn.'
            USING ERRCODE = 'P0005';
    END IF;

    -- Update post
    UPDATE post
    SET
        index = p_index,
        name = p_name,
        title = p_title,
        describe = p_describe,
        images = p_images,
        is_active = p_is_active
    WHERE id = p_id;

    -- Tương đương @@ROWCOUNT = 0
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Chỉnh sửa bài đăng không thành công.'
            USING ERRCODE = 'P0006';
    END IF;

    -- Trả về post sau khi update
    RETURN QUERY
    SELECT *
    FROM post
    WHERE id = p_id;
END;
$$;