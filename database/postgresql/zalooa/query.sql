CREATE OR REPLACE FUNCTION get_zalo_app_with_account_id (
    p_account_id UUID
)
RETURNS SETOF zalo_app
LANGUAGE sql
AS $$
    SELECT za.*
    FROM zalo_app AS za
    WHERE
        za.status = 'normal'
        AND za.account_id = p_account_id;
$$;

CREATE OR REPLACE FUNCTION get_zalo_oa_list_with_2_fk (
    p_page INT,
    p_size INT,
    p_zalo_app_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE sql
AS $$
    WITH filtered_zalo_oa AS (
        SELECT zo.*
        FROM zalo_oa zo
        WHERE
            zo.status = 'normal'
            AND (p_zalo_app_id IS NULL OR zo.zalo_app_id = p_zalo_app_id)
            AND (p_account_id IS NULL OR zo.account_id = p_account_id)
    ),
    paginated AS (
        SELECT *
        FROM filtered_zalo_oa
        ORDER BY id DESC
        LIMIT p_size
        OFFSET (p_page - 1) * p_size
    )
    SELECT
        COALESCE(
            (
                SELECT jsonb_agg(
                    to_jsonb(p)
                    ORDER BY p.id DESC
                )
                FROM paginated p
            ),
            '[]'::JSONB
        ) AS items,
        (
            SELECT COUNT(*)
            FROM filtered_zalo_oa
        ) AS total_count;
$$;

CREATE OR REPLACE FUNCTION is_my_oa (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF zalo_oa
LANGUAGE sql
AS $$
    SELECT zo.*
    FROM zalo_oa AS zo
    WHERE
        zo.status = 'normal'
        AND zo.id = p_id
        AND zo.account_id = p_account_id;
$$;

CREATE OR REPLACE FUNCTION get_zalo_oa_with_id (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF zalo_oa
LANGUAGE sql
AS $$
    SELECT zo.*
    FROM zalo_oa AS zo
    WHERE
        zo.status = 'normal'
        AND zo.id = p_id
        AND zo.account_id = p_account_id;
$$;

CREATE OR REPLACE FUNCTION get_zalo_oa_with_oa_id (
    p_oa_id VARCHAR(255),
    p_account_id UUID
)
RETURNS SETOF zalo_oa
LANGUAGE sql
AS $$
    SELECT zo.*
    FROM zalo_oa AS zo
    WHERE
        zo.status = 'normal'
        AND zo.oa_id = p_oa_id
        AND zo.account_id = p_account_id;
$$;

CREATE OR REPLACE FUNCTION check_zalo_app_with_app_id (
    p_app_id VARCHAR(255)
)
RETURNS SETOF zalo_app
LANGUAGE sql
AS $$
    SELECT za.*
    FROM zalo_app AS za
    WHERE
        za.status = 'normal'
        AND za.app_id = p_app_id;
$$;

CREATE OR REPLACE FUNCTION check_zalo_oa_list_with_zalo_app_id (
    p_zalo_app_id UUID
)
RETURNS SETOF zalo_oa
LANGUAGE sql
AS $$
    SELECT zo.*
    FROM zalo_oa AS zo
    WHERE
        zo.status = 'normal'
        AND zo.zalo_app_id = p_zalo_app_id;
$$;

CREATE OR REPLACE FUNCTION get_zalo_oa_token_with_fk (
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF zalo_oa_token
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
BEGIN

    -- Lấy added_by_id của account
    SELECT ai.added_by_id
    INTO v_added_by_id
    FROM account_information AS ai
    WHERE ai.account_id = p_account_id;

    -- Không tìm thấy added_by_id
    IF v_added_by_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy addedById.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Kiểm tra OA có thuộc added_by_id hay không
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa AS zo
        WHERE
            zo.id = p_zalo_oa_id
            AND zo.account_id = v_added_by_id
    ) THEN
        RAISE EXCEPTION 'Không phải OA của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả toàn bộ token
    RETURN QUERY
    SELECT zot.*
    FROM zalo_oa_token AS zot
    WHERE zot.zalo_oa_id = p_zalo_oa_id;

END;
$$;

CREATE OR REPLACE FUNCTION playwright_get_zalo_app (
    p_user_name VARCHAR(100),
    p_password VARCHAR(100)
)
RETURNS TABLE (
    items JSONB,
    account_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_account_id UUID;
BEGIN

    -- Tìm account
    SELECT a.id
    INTO v_account_id
    FROM account AS a
    WHERE
        a.user_name = p_user_name
        AND a.password = p_password
        AND a.status = 'normal';

    -- Không tìm thấy tài khoản
    IF v_account_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm tài khoản'
            USING ERRCODE = 'P0001';
    END IF;

    -- Trả danh sách Zalo App + account_id
    SELECT COALESCE(
        jsonb_agg(to_jsonb(za)),
        '[]'::JSONB
    )
    INTO items
    FROM zalo_app AS za
    WHERE
        za.account_id = v_account_id
        AND za.status = 'normal';

    account_id := v_account_id;

    RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION get_zns_templates (
    p_page INT,
    p_size INT,
    p_offset INT,
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN

    -- Kiểm tra OA có thuộc account không
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_oa
        WHERE id = p_zalo_oa_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải OA của bạn.';
    END IF;

    RETURN QUERY
    SELECT
        COALESCE(
            (
                SELECT jsonb_agg(row_data ORDER BY row_data.id DESC)
                FROM (
                    SELECT z.*
                    FROM zns_template z
                    WHERE z.zalo_oa_id = p_zalo_oa_id
                      AND z.is_delete = false
                    ORDER BY z.id DESC
                    LIMIT p_size
                    OFFSET ((p_page - 1) * p_size) + p_offset
                ) AS row_data
            ),
            '[]'::jsonb
        ) AS items,

        (
            SELECT COUNT(*)
            FROM zns_template z
            WHERE z.zalo_oa_id = p_zalo_oa_id
              AND z.is_delete = false
        ) AS total_count;

END;
$$;

CREATE OR REPLACE FUNCTION get_zns_template_with_id (
    p_id UUID,
    p_account_id UUID
)
RETURNS SETOF zns_template
LANGUAGE plpgsql
AS $$
DECLARE
    v_zalo_oa_id UUID;
    v_admin_id UUID;
BEGIN

    -- 1. Lấy zalo_oa_id của ZNS Template
    SELECT z.zalo_oa_id
    INTO v_zalo_oa_id
    FROM zns_template z
    WHERE z.id = p_id;

    IF v_zalo_oa_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy zaloOa';
    END IF;


    -- 2. Kiểm tra ZNS Template có bị xóa không
    IF NOT EXISTS (
        SELECT 1
        FROM zns_template z
        WHERE z.id = p_id
          AND z.is_delete = false
    ) THEN
        RAISE EXCEPTION 'ZnsTemplate này đã bị xóa';
    END IF;


    -- 3. Lấy admin account của OA
    SELECT zoa.account_id
    INTO v_admin_id
    FROM zalo_oa zoa
    WHERE zoa.id = v_zalo_oa_id;

    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy Admin';
    END IF;


    -- 4. Kiểm tra account hiện tại có thuộc admin này không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information ai
        WHERE ai.added_by_id = v_admin_id
          AND ai.account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Admin này không phải của bạn';
    END IF;


    -- 5. Trả về ZNS Template
    RETURN QUERY
    SELECT z.*
    FROM zns_template z
    WHERE z.id = p_id;

END;
$$;

CREATE OR REPLACE FUNCTION get_zns_messages (
    p_page INT,
    p_size INT,
    p_zns_template_id UUID,
    p_account_id UUID
)
RETURNS SETOF zns_message
LANGUAGE sql
AS $$
    WITH paged_dates AS (
        SELECT DISTINCT
            (zm.create_time AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE AS create_date
        FROM zns_message zm
        WHERE zm.account_id = p_account_id
          AND zm.zns_template_id = p_zns_template_id
        ORDER BY create_date DESC
        LIMIT p_size
        OFFSET (p_page - 1) * p_size
    )
    SELECT
        z.id,
        z.type,
        z.data,
        z.cost,
        z.zns_template_id,
        z.account_id,
        z.create_time
    FROM zns_message z
    INNER JOIN paged_dates d
        ON (
            z.create_time AT TIME ZONE 'Asia/Ho_Chi_Minh'
        )::DATE = d.create_date
    WHERE z.account_id = p_account_id
      AND z.zns_template_id = p_zns_template_id
    ORDER BY z.create_time DESC;
$$;