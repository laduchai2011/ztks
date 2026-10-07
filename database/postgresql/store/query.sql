CREATE OR REPLACE FUNCTION get_my_shops (
    p_limit INTEGER DEFAULT 20,
    p_cursor UUID DEFAULT NULL,
    p_account_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_items JSONB;
    v_next_cursor UUID;
BEGIN
    -- Giới hạn limit để tránh request quá lớn
    IF p_limit IS NULL OR p_limit <= 0 THEN
        p_limit := 20;
    END IF;

    IF p_limit > 100 THEN
        p_limit := 100;
    END IF;

    /*
        Lấy danh sách shop
        Cursor:
            NULL -> trang đầu
            Có cursor -> lấy các bản ghi có id nhỏ hơn cursor
    */
    SELECT
        COALESCE(
            jsonb_agg(
                to_jsonb(t)
                ORDER BY t.id DESC
            ),
            '[]'::JSONB
        )
    INTO v_items
    FROM (
        SELECT
            s.id,
            s.name,
            s.description,
            s.content,
            s.address,
            s.phone,
            s.account_id,
            s.create_time
        FROM shop s
        WHERE s.is_delete = FALSE
            AND (
                p_account_id IS NULL
                OR s.account_id = p_account_id
            )
            AND (
                p_cursor IS NULL
                OR s.id < p_cursor
            )
        ORDER BY s.id DESC
        LIMIT p_limit
    ) t;

    /*
        Lấy cursor của bản ghi cuối cùng
    */
    SELECT
        t.id
    INTO v_next_cursor
    FROM (
        SELECT
            s.id
        FROM shop s
        WHERE s.is_delete = FALSE
            AND (
                p_account_id IS NULL
                OR s.account_id = p_account_id
            )
            AND (
                p_cursor IS NULL
                OR s.id < p_cursor
            )
        ORDER BY s.id DESC
        LIMIT p_limit
    ) t
    ORDER BY t.id ASC
    LIMIT 1;

    RETURN jsonb_build_object(
        'items', v_items,
        'next_cursor', v_next_cursor
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_my_depots (
    p_limit INTEGER DEFAULT 20,
    p_cursor UUID DEFAULT NULL,
    p_shop_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_items JSONB;
    v_next_cursor UUID;
BEGIN
    -- Giới hạn limit để tránh request quá lớn
    IF p_limit IS NULL OR p_limit <= 0 THEN
        p_limit := 20;
    END IF;

    IF p_limit > 100 THEN
        p_limit := 100;
    END IF;

    /*
        Lấy danh sách shop
        Cursor:
            NULL -> trang đầu
            Có cursor -> lấy các bản ghi có id nhỏ hơn cursor
    */
    SELECT
        COALESCE(
            jsonb_agg(
                to_jsonb(t)
                ORDER BY t.id DESC
            ),
            '[]'::JSONB
        )
    INTO v_items
    FROM (
        SELECT
            d.id,
            d.name,
            d.description,
            d.content,
            d.address,
            d.phone,
            d.shop_id,
            d.create_time
        FROM depot d
        WHERE d.is_delete = FALSE
            AND (
                p_shop_id IS NULL
                OR d.shop_id = p_shop_id
            )
            AND (
                p_cursor IS NULL
                OR d.id < p_cursor
            )
        ORDER BY d.id DESC
        LIMIT p_limit
    ) t;

    /*
        Lấy cursor của bản ghi cuối cùng
    */
    SELECT
        t.id
    INTO v_next_cursor
    FROM (
        SELECT
            d.id
        FROM depot d
        WHERE d.is_delete = FALSE
            AND (
                p_shop_id IS NULL
                OR d.shop_id = p_shop_id
            )
            AND (
                p_cursor IS NULL
                OR d.id < p_cursor
            )
        ORDER BY d.id DESC
        LIMIT p_limit
    ) t
    ORDER BY t.id ASC
    LIMIT 1;

    RETURN jsonb_build_object(
        'items', v_items,
        'next_cursor', v_next_cursor
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_my_stores (
    p_limit INTEGER DEFAULT 20,
    p_cursor UUID DEFAULT NULL,
    p_depot_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_items JSONB;
    v_next_cursor UUID;
BEGIN
    -- Giới hạn limit để tránh request quá lớn
    IF p_limit IS NULL OR p_limit <= 0 THEN
        p_limit := 20;
    END IF;

    IF p_limit > 100 THEN
        p_limit := 100;
    END IF;

    /*
        Lấy danh sách store

        Cursor:
            NULL -> trang đầu
            Có cursor -> lấy các bản ghi có id nhỏ hơn cursor

        Sort:
            id DESC
    */
    SELECT
        COALESCE(
            jsonb_agg(
                to_jsonb(t)
                ORDER BY t.id DESC
            ),
            '[]'::JSONB
        )
    INTO v_items
    FROM (
        SELECT
            s.id,
            s.name,
            s.description,
            s.content,
            s.is_delete,
            s.depot_id,
            s.create_time
        FROM store s
        WHERE s.is_delete = FALSE
            AND (
                p_depot_id IS NULL
                OR s.depot_id = p_depot_id
            )
            AND (
                p_cursor IS NULL
                OR s.id < p_cursor
            )
        ORDER BY s.id DESC
        LIMIT p_limit
    ) t;

    /*
        Lấy cursor của bản ghi cuối cùng
    */
    SELECT
        t.id
    INTO v_next_cursor
    FROM (
        SELECT
            s.id
        FROM store s
        WHERE s.is_delete = FALSE
            AND (
                p_depot_id IS NULL
                OR s.depot_id = p_depot_id
            )
            AND (
                p_cursor IS NULL
                OR s.id < p_cursor
            )
        ORDER BY s.id DESC
        LIMIT p_limit
    ) t
    ORDER BY t.id ASC
    LIMIT 1;

    RETURN jsonb_build_object(
        'items', v_items,
        'next_cursor', v_next_cursor
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_shop_role (
    p_type VARCHAR(50),
	p_is_lock BOOLEAN,
    p_is_delete BOOLEAN,
	p_shop_id UUID, 
	p_account_id UUID
)
RETURNS SETOF shop_role
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM shop_role
    WHERE shop_id = p_shop_id 
		AND account_id = p_account_id
		AND type = p_type
		AND is_lock = p_is_lock
		AND is_delete = p_is_delete;
END;
$$;

CREATE OR REPLACE FUNCTION get_depot_role (
    p_type VARCHAR(50),
	p_is_lock BOOLEAN,
    p_is_delete BOOLEAN,
	p_depot_id UUID, 
	p_account_id UUID
)
RETURNS SETOF depot_role
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM depot_role
    WHERE depot_id = p_depot_id 
		AND account_id = p_account_id
		AND type = p_type
		AND is_lock = p_is_lock
		AND is_delete = p_is_delete;
END;
$$;

CREATE OR REPLACE FUNCTION get_store_role (
    p_type VARCHAR(50),
	p_is_lock BOOLEAN,
    p_is_delete BOOLEAN,
	p_store_id UUID, 
	p_account_id UUID
)
RETURNS SETOF store_role
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM store_role
    WHERE store_id = p_store_id 
		AND account_id = p_account_id
		AND type = p_type
		AND is_lock = p_is_lock
		AND is_delete = p_is_delete;
END;
$$;

-- DROP FUNCTION get_latest_shop_pay_with_shop_id(uuid)
CREATE OR REPLACE FUNCTION get_latest_shop_pay_with_shop_id (
    p_shop_id UUID,
	p_account_id UUID
)
RETURNS SETOF shop_pay
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM shop_pay
    WHERE shop_id = p_shop_id AND account_id = p_account_id
	ORDER BY create_time DESC
	LIMIT 1;
END;
$$;