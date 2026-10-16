CREATE OR REPLACE FUNCTION get_shop_by_id (
    p_id UUID
)
RETURNS SETOF shop
LANGUAGE sql
STABLE
AS $$
    SELECT s.*
    FROM shop s
    WHERE s.id = p_id;
$$;


CREATE OR REPLACE FUNCTION get_depot_by_id (
    p_id UUID
)
RETURNS SETOF depot
LANGUAGE sql
STABLE
AS $$
    SELECT d.*
    FROM depot d
    WHERE d.id = p_id;
$$;

CREATE OR REPLACE FUNCTION get_store_by_id (
    p_id UUID
)
RETURNS SETOF store
LANGUAGE sql
STABLE
AS $$
    SELECT s.*
    FROM store s
    WHERE s.id = p_id;
$$;


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


-- CREATE OR REPLACE FUNCTION get_shop_role_statistics_for_one_team (
--     p_team_id UUID,
--     p_shop_id UUID,
--     p_type VARCHAR(50)
-- )
-- RETURNS TABLE (
--     total_members BIGINT,
--     locked_members BIGINT
-- )
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     IF p_type NOT IN ('sales', 'store') OR p_type IS NULL THEN
--         RAISE EXCEPTION 'Invalid type: %. Allowed values: sales, store', p_type;
--     END IF;

--     RETURN QUERY
--     SELECT
--         COUNT(*) AS total_members,
--         COUNT(*) FILTER (
--             WHERE sr.id IS NULL
--                OR (
--                     sr.is_lock = TRUE
--                     AND sr.is_delete = FALSE
--                )
--         ) AS locked_members
--     FROM team_member tm
--     LEFT JOIN shop_role sr
--         ON sr.account_id = tm.account_id
--        AND sr.shop_id = p_shop_id
--        AND sr.type = p_type
--        AND sr.is_delete = FALSE
--     WHERE tm.team_id = p_team_id
--       AND tm.is_delete = FALSE;
-- END;
-- $$;


-- CREATE OR REPLACE FUNCTION get_shop_role_for_one_account (
--     p_account_id UUID,
--     p_shop_id UUID,
--     p_type VARCHAR(50)
-- )
-- RETURNS SETOF shop_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION
--             'Invalid type: %. Allowed values: sales, store',
--             p_type;
--     END IF;

--     RETURN QUERY
--     SELECT sr.*
--     FROM shop_role sr
--     WHERE sr.account_id = p_account_id
--       AND sr.shop_id = p_shop_id
--       AND sr.type = p_type
--       AND sr.is_delete = FALSE;
-- END;
-- $$;


-- CREATE OR REPLACE FUNCTION get_depot_role_statistics_for_one_team (
--     p_team_id UUID,
--     p_depot_id UUID,
--     p_type VARCHAR(50)
-- )
-- RETURNS TABLE (
--     total_members BIGINT,
--     locked_members BIGINT
-- )
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     IF p_type NOT IN ('sales', 'store') OR p_type IS NULL THEN
--         RAISE EXCEPTION 'Invalid type: %. Allowed values: sales, store', p_type;
--     END IF;

--     RETURN QUERY
--     SELECT
--         COUNT(*) AS total_members,
--         COUNT(*) FILTER (
--             WHERE dr.id IS NULL
--                OR (
--                     dr.is_lock = TRUE
--                     AND dr.is_delete = FALSE
--                )
--         ) AS locked_members
--     FROM team_member tm
--     LEFT JOIN depot_role dr
--         ON dr.account_id = tm.account_id
--        AND dr.depot_id = p_depot_id
--        AND dr.type = p_type
--        AND dr.is_delete = FALSE
--     WHERE tm.team_id = p_team_id
--       AND tm.is_delete = FALSE;
-- END;
-- $$;

-- CREATE OR REPLACE FUNCTION get_depot_role_for_one_account (
--     p_account_id UUID,
--     p_depot_id UUID,
--     p_type VARCHAR(50)
-- )
-- RETURNS SETOF depot_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION
--             'Invalid type: %. Allowed values: sales, store',
--             p_type;
--     END IF;

--     RETURN QUERY
--     SELECT dr.*
--     FROM depot_role dr
--     WHERE dr.account_id = p_account_id
--       AND dr.shop_id = p_shop_id
--       AND dr.type = p_type
--       AND dr.is_delete = FALSE;
-- END;
-- $$;

CREATE OR REPLACE FUNCTION get_team_shops (
    p_team_id UUID,
    p_limit INTEGER DEFAULT 20,
	p_cursor UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_items JSONB;
    v_next_cursor UUID;
    v_limit INTEGER;
BEGIN
    v_limit := LEAST(
        GREATEST(COALESCE(p_limit, 20), 1),
        100
    );

    WITH filtered AS (
        SELECT
            ts.id,
            ts.is_lock,
            ts.is_delete,
            ts.shop_id,
            ts.team_id,
            ts.create_time
        FROM team_shop ts
        WHERE ts.team_id = p_team_id
          AND ts.is_delete = FALSE
          AND (
              p_cursor IS NULL
              OR (ts.create_time, ts.id) < (
                  SELECT c.create_time, c.id
                  FROM team_shop c
                  WHERE c.id = p_cursor
                    AND c.team_id = p_team_id
                    AND c.is_delete = FALSE
              )
          )
        ORDER BY ts.create_time DESC, ts.id DESC
        LIMIT v_limit + 1
    ),
    page AS (
        SELECT *
        FROM filtered
        ORDER BY create_time DESC, id DESC
        LIMIT v_limit
    )
    SELECT
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', p.id,
                        'is_lock', p.is_lock,
                        'is_delete', p.is_delete,
                        'shop_id', p.shop_id,
                        'team_id', p.team_id,
                        'create_time', p.create_time
                    )
                    ORDER BY p.create_time DESC, p.id DESC
                )
                FROM page p
            ),
            '[]'::JSONB
        ),
        CASE
            WHEN (SELECT COUNT(*) FROM filtered) > v_limit
            THEN (
                SELECT p.id
                FROM page p
                ORDER BY p.create_time ASC, p.id ASC
                LIMIT 1
            )
            ELSE NULL
        END
    INTO v_items, v_next_cursor;

    RETURN jsonb_build_object(
        'items', v_items,
        'next_cursor', v_next_cursor
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_team_shop_depots (
	p_team_shop_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_cursor UUID DEFAULT NULL
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
        Lấy danh sách team_shop_depot
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
            tsd.id,
            tsd.is_lock,
            tsd.is_delete,
            tsd.depot_id,
            tsd.team_shop_id,
            tsd.create_time
        FROM team_shop_depot tsd
        WHERE tsd.is_delete = FALSE
            AND tsd.team_shop_id = p_team_shop_id
            AND (
                p_cursor IS NULL
                OR tsd.id < p_cursor
            )
        ORDER BY tsd.id DESC
        LIMIT p_limit
    ) t;

    /*
        Lấy cursor của bản ghi cuối cùng
    */
    SELECT t.id
    INTO v_next_cursor
    FROM (
        SELECT tsd.id
        FROM team_shop_depot tsd
        WHERE tsd.is_delete = FALSE
            AND tsd.team_shop_id = p_team_shop_id
            AND (
                p_cursor IS NULL
                OR tsd.id < p_cursor
            )
        ORDER BY tsd.id DESC
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

CREATE OR REPLACE FUNCTION get_team_shop_depot_stores (
	p_team_shop_depot_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_cursor UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_items JSONB;
    v_next_cursor UUID;
BEGIN
    /*
        Lấy danh sách team_shop_depot_store
        Cursor:
            NULL -> trang đầu
            Có cursor -> lấy các bản ghi có id nhỏ hơn cursor
    */

    -- Giới hạn limit để tránh request quá lớn
    IF p_limit IS NULL OR p_limit <= 0 THEN
        p_limit := 20;
    END IF;

    IF p_limit > 100 THEN
        p_limit := 100;
    END IF;

    -- Lấy danh sách team_shop_depot_store
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
            tsds.id,
            tsds.is_lock,
            tsds.is_delete,
            tsds.store_id,
            tsds.team_shop_depot_id,
            tsds.create_time
        FROM team_shop_depot_store tsds
        WHERE tsds.is_delete = FALSE
            AND tsds.team_shop_depot_id = p_team_shop_depot_id
            AND (
                p_cursor IS NULL
                OR tsds.id < p_cursor
            )
        ORDER BY tsds.id DESC
        LIMIT p_limit
    ) t;

    -- Lấy cursor của bản ghi cuối cùng
    SELECT
        t.id
    INTO v_next_cursor
    FROM (
        SELECT
            tsds.id
        FROM team_shop_depot_store tsds
        WHERE tsds.is_delete = FALSE
            AND tsds.team_shop_depot_id = p_team_shop_depot_id
            AND (
                p_cursor IS NULL
                OR tsds.id < p_cursor
            )
        ORDER BY tsds.id DESC
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