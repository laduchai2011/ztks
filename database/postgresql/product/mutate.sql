CREATE OR REPLACE FUNCTION create_product_code (
    p_name VARCHAR(255),
	p_description VARCHAR(255),
	p_detail TEXT,
	p_account_id UUID,
	p_images JSONB DEFAULT '[]'::JSONB,
    p_videos JSONB DEFAULT '[]'::JSONB
)
RETURNS SETOF product_code
LANGUAGE plpgsql
AS $$
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

CREATE OR REPLACE FUNCTION upsert_product_code_total (
    p_active_total INTEGER,
    p_deleted_total INTEGER,
    p_admin_account_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO product_code_total (
        active_total,
        deleted_total,
        admin_account_id
    )
    VALUES (
        p_active_total,
        p_deleted_total,
        p_admin_account_id
    )
    ON CONFLICT (admin_account_id)
    DO UPDATE SET
        active_total = product_code_total.active_total + EXCLUDED.active_total,
        deleted_total = product_code_total.deleted_total + EXCLUDED.deleted_total;
END;
$$;

CREATE OR REPLACE FUNCTION edit_product_code (
    p_id UUID,
    p_name VARCHAR(255),
    p_description VARCHAR(255),
    p_detail TEXT,
	p_account_id UUID,
   	p_images JSONB DEFAULT '[]'::JSONB,
    p_videos JSONB DEFAULT '[]'::JSONB
   
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
    p_is_compelled_price BOOLEAN,
    p_unit_price NUMERIC(18, 2),
    p_store_id UUID,
    p_product_code_id UUID,
    p_account_id UUID,
    p_images JSONB DEFAULT '[]'::JSONB,
    p_videos JSONB DEFAULT '[]'::JSONB
)
RETURNS SETOF product
LANGUAGE plpgsql
AS $$
DECLARE
    v_product_id UUID;
BEGIN
    -- 1. Kiểm tra tài khoản admin
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin.'
            USING ERRCODE = 'P0001';
    END IF;

	-- 2. Kiểm tra product_code thuộc account_id
	IF NOT EXISTS (
	    SELECT 1
	    FROM product_code pc
	    WHERE pc.id = p_product_code_id
	      AND pc.account_id = p_account_id
	      AND pc.is_delete = FALSE
	) THEN
	    RAISE EXCEPTION 'PRODUCT_CODE_NOT_FOUND_OR_ACCESS_DENIED'
	        USING ERRCODE = 'P0001';
	END IF;

	IF p_store_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM store st
    INNER JOIN depot d
        ON d.id = st.depot_id
    INNER JOIN shop s
        ON s.id = d.shop_id
    WHERE st.id = p_store_id
      AND s.account_id = p_account_id
	) THEN
	    RAISE EXCEPTION 'STORE_NOT_FOUND_OR_ACCESS_DENIED';
	END IF;

    -- 2. Kiểm tra số lượng
    IF p_quantity < 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than or equal to 0';
    END IF;

    -- 3. Kiểm tra đơn giá
    IF p_unit_price < 0 THEN
        RAISE EXCEPTION 'Unit price must be greater than or equal to 0';
    END IF;

    -- 4. Tạo sản phẩm
    INSERT INTO product (
        name,
        description,
        detail,
        quantity_in,
        quantity_out,
        images,
        videos,
        is_compelled_price,
        unit_price,
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
        p_images,
        p_videos,
        p_is_compelled_price,
        p_unit_price,
        p_store_id,
        p_product_code_id,
        p_account_id
    )
    RETURNING id INTO v_product_id;

    -- 5. Trả về sản phẩm
    RETURN QUERY
    SELECT p.*
    FROM product p
    WHERE p.id = v_product_id;

END;
$$;


CREATE OR REPLACE FUNCTION edit_product (
    p_id UUID,
    p_name VARCHAR(255),
    p_description VARCHAR(255),
    p_detail TEXT,
    p_is_compelled_price BOOLEAN,
    p_unit_price NUMERIC(18, 2),
    p_is_lock BOOLEAN,
    p_store_id UUID,
    p_product_code_id UUID,
	p_account_id UUID,
	p_images JSONB DEFAULT '[]'::JSONB,
    p_videos JSONB DEFAULT '[]'::JSONB
)
RETURNS product
LANGUAGE plpgsql
AS $$
DECLARE
    v_product product%ROWTYPE;
BEGIN
	-- 1. Kiểm tra tài khoản admin
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE account_id = p_account_id
          AND account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin.'
            USING ERRCODE = 'P0001';
    END IF;

	IF p_store_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM store st
    INNER JOIN depot d
        ON d.id = st.depot_id
    INNER JOIN shop s
        ON s.id = d.shop_id
    WHERE st.id = p_store_id
      AND s.account_id = p_account_id
	) THEN
	    RAISE EXCEPTION 'STORE_NOT_FOUND_OR_ACCESS_DENIED';
	END IF;
	
    -- Kiểm tra tham số
    IF p_id IS NULL OR p_account_id IS NULL THEN
        RAISE EXCEPTION 'INVALID_ARGUMENT';
    END IF;

    -- Lấy sản phẩm và khóa record
    SELECT *
    INTO v_product
    FROM product
    WHERE id = p_id
      AND account_id = p_account_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'PRODUCT_NOT_FOUND';
    END IF;

    IF p_unit_price IS NOT NULL AND p_unit_price < 0 THEN
        RAISE EXCEPTION 'INVALID_UNIT_PRICE';
    END IF;

    IF p_images IS NOT NULL
       AND jsonb_typeof(p_images) <> 'array' THEN
        RAISE EXCEPTION 'INVALID_IMAGES';
    END IF;

    IF p_videos IS NOT NULL
       AND jsonb_typeof(p_videos) <> 'array' THEN
        RAISE EXCEPTION 'INVALID_VIDEOS';
    END IF;

    IF p_store_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM store WHERE id = p_store_id
    ) THEN
        RAISE EXCEPTION 'STORE_NOT_FOUND';
    END IF;

    IF p_product_code_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM product_code WHERE id = p_product_code_id
    ) THEN
        RAISE EXCEPTION 'PRODUCT_CODE_NOT_FOUND';
    END IF;

    UPDATE product
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        detail = COALESCE(p_detail, detail),
        images = COALESCE(p_images, images),
        videos = COALESCE(p_videos, videos),
        is_compelled_price = COALESCE(p_is_compelled_price, is_compelled_price),
        unit_price = COALESCE(p_unit_price, unit_price),
        is_lock = COALESCE(p_is_lock, is_lock),
        store_id = COALESCE(p_store_id, store_id),
        product_code_id = COALESCE(p_product_code_id, product_code_id),
        update_time = CURRENT_TIMESTAMP
    WHERE id = p_id
      AND account_id = p_account_id
    RETURNING *
    INTO v_product;

    RETURN v_product;
END;
$$;


CREATE OR REPLACE FUNCTION delete_product (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF product
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE product
    SET
        is_delete = TRUE,
        update_time = CURRENT_TIMESTAMP
    WHERE
        id = p_id
        AND account_id = p_account_id
        AND is_delete = FALSE
    RETURNING *;
END;
$$;


CREATE OR REPLACE FUNCTION re_delete_product (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF product
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE product
    SET
        is_delete = FALSE,
        update_time = CURRENT_TIMESTAMP
    WHERE
        id = p_id
        AND account_id = p_account_id
        AND is_delete = TRUE
    RETURNING *;
END;
$$;


CREATE OR REPLACE FUNCTION upsert_product_total (
    p_active_total INTEGER,
    p_deleted_total INTEGER,
    p_admin_account_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO product_total (
        active_total,
        deleted_total,
        admin_account_id
    )
    VALUES (
        p_active_total,
        p_deleted_total,
        p_admin_account_id
    )
    ON CONFLICT (admin_account_id)
    DO UPDATE SET
        active_total = product_total.active_total + EXCLUDED.active_total,
        deleted_total = product_total.deleted_total + EXCLUDED.deleted_total;
END;
$$;


CREATE OR REPLACE FUNCTION fluctuation_for_create_product (
    p_quantity INTEGER,
    p_images JSONB,
    p_videos JSONB,
    p_product_id UUID,
    p_account_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_fluctuation_id UUID;
BEGIN
    INSERT INTO product_fluctuation (
        type,
        command,
        quantity,
        actual_quantity,
        note,
        images,
        videos,
        is_finish,
        product_id,
        account_id,
        finish_time
    )
    VALUES (
        'in',
        'add_new',
        p_quantity,
        p_quantity,
        '',
        p_images,
		p_videos,
        TRUE,
        p_product_id,
        p_account_id,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_fluctuation_id;

    RETURN v_fluctuation_id;
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