CREATE OR REPLACE FUNCTION create_product_code (
    p_name VARCHAR(255),
	p_description VARCHAR(255),
	p_detail TEXT,
	p_images TEXT[],
	p_videos TEXT[],
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

    -- Tạo product_code
    RETURN QUERY
    INSERT INTO product_code (
       	name,
		description,
		detail,
		images,
		videos,
		account_id
    )
    VALUES (
       	p_name,
		p_description,
		p_detail,
		p_images,
		p_videos,
		p_account_id
    )
	RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION edit_product_code (
    p_id UUID,
    p_name VARCHAR(255),
    p_description VARCHAR(255),
    p_detail TEXT,
    p_images TEXT[],
    p_videos TEXT[],
    p_account_id UUID
)
RETURNS SETOF product_code
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE product_code
    SET
        name = p_name,
        description = p_description,
        detail = p_detail,
        images = p_images,
        videos = p_videos
    WHERE id = p_id
      AND account_id = p_account_id
      AND is_delete = FALSE
    RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION create_product (
    p_name VARCHAR(255),
    p_description VARCHAR(255),
    p_detail TEXT,
    p_quantity INTEGER,
    p_images TEXT[],
    p_videos TEXT[],
    p_store_id UUID,
    p_product_code_id UUID,
    p_account_id UUID,
    p_note VARCHAR(255)
)
RETURNS SETOF product
LANGUAGE plpgsql
AS $$
DECLARE
    v_product_id UUID;
BEGIN

    -- Kiểm tra số lượng
    IF p_quantity < 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than or equal to 0';
    END IF;


    -- 1. Tạo product
    INSERT INTO product (
        name,
        description,
        detail,
        quantity_in,
        quantity_out,
        images,
        videos,
        store_id,
        product_code_id,
        account_id
    )
    VALUES (
        p_name,
        p_description,
        p_detail,
        p_quantity,
        0,
        COALESCE(p_images, '{}'),
        COALESCE(p_videos, '{}'),
        p_store_id,
        p_product_code_id,
        p_account_id
    )
    RETURNING id
    INTO v_product_id;


    -- 2. Tạo product fluctuation
    INSERT INTO product_fluctuation (
        type,
        command,
        quantity,
        actual_quantity,
        note,
        product_id,
        account_id
    )
    VALUES (
        'in',
        'add_new',
        p_quantity,
        p_quantity,
        p_note,
        v_product_id,
        p_account_id
    );


    -- 3. Trả về product
    RETURN QUERY
    SELECT p.*
    FROM product p
    WHERE p.id = v_product_id;

END;
$$;

CREATE OR REPLACE FUNCTION transfer_product (
    p_source_product_id UUID,
    p_target_product_id UUID,
    p_quantity INTEGER,
    p_source_account_id UUID,
    p_target_account_id UUID,
    p_note VARCHAR(255),
	p_account_id UUID
)
RETURNS TABLE (
    source_product product,
    target_product product
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_source_product product;
    v_target_product product;
    v_source_quantity INTEGER;
BEGIN

    -- Không cho phép chuyển chính nó
    IF p_source_product_id = p_target_product_id THEN
        RAISE EXCEPTION 'Source product and target product cannot be the same';
    END IF;


    -- Số lượng phải > 0
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Transfer quantity must be greater than 0';
    END IF;


    -- Lock product nguồn
    SELECT *
    INTO v_source_product
    FROM product
    WHERE id = p_source_product_id
      AND account_id = p_account_id
      AND is_delete = FALSE
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source product not found: %',
            p_source_product_id;
    END IF;


    -- Lock product đích
    SELECT *
    INTO v_target_product
    FROM product
    WHERE id = p_target_product_id
      AND account_id = p_account_id
      AND is_delete = FALSE
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target product not found: %',
            p_target_product_id;
    END IF;


    -- Tồn kho hiện tại
    v_source_quantity :=
        v_source_product.quantity_in
        - v_source_product.quantity_out;


    -- Kiểm tra đủ hàng
    IF v_source_quantity < p_quantity THEN
        RAISE EXCEPTION
            'Insufficient quantity. Current: %, requested: %',
            v_source_quantity,
            p_quantity;
    END IF;


    /*
     * ==========================================
     * 1. TRỪ HÀNG PRODUCT NGUỒN
     * ==========================================
     */
    UPDATE product
    SET quantity_out = quantity_out + p_quantity
    WHERE id = p_source_product_id;


    /*
     * ==========================================
     * 2. CỘNG HÀNG PRODUCT ĐÍCH
     * ==========================================
     */
    UPDATE product
    SET quantity_in = quantity_in + p_quantity
    WHERE id = p_target_product_id;


    /*
     * ==========================================
     * 3. FLUCTUATION PRODUCT NGUỒN
     * ==========================================
     */
    INSERT INTO product_fluctuation (
        type,
        command,
        quantity,
        note,
        source_product_id,
        target_product_id,
        source_account_id,
        target_account_id,
        product_id,
        account_id
    )
    VALUES (
        'out',
        'sub_to_other_product',
        p_quantity,
        p_note,
        p_source_product_id,
        p_target_product_id,
        p_source_account_id,
        p_target_account_id,
        p_source_product_id,
        p_account_id
    );


    /*
     * ==========================================
     * 4. FLUCTUATION PRODUCT ĐÍCH
     * ==========================================
     */
    INSERT INTO product_fluctuation (
        type,
        command,
        quantity,
        note,
        source_product_id,
        target_product_id,
        source_account_id,
        target_account_id,
        product_id,
        account_id
    )
    VALUES (
        'in',
        'add_from_other_product',
        p_quantity,
        p_note,
        p_source_product_id,
        p_target_product_id,
        p_source_account_id,
        p_target_account_id,
        p_target_product_id,
        p_account_id
    );


    /*
     * ==========================================
     * 5. LẤY PRODUCT SAU KHI UPDATE
     * ==========================================
     */
    SELECT *
    INTO v_source_product
    FROM product
    WHERE id = p_source_product_id;


    SELECT *
    INTO v_target_product
    FROM product
    WHERE id = p_target_product_id;


    RETURN QUERY
    SELECT
        v_source_product,
        v_target_product;

END;
$$;