CREATE OR REPLACE FUNCTION signin (
    p_user_name VARCHAR(100),
    p_password VARCHAR(100)
)
RETURNS SETOF account
LANGUAGE sql
AS $$
    SELECT *
    FROM account
    WHERE is_delete = FALSE
	  AND user_name = p_user_name
      AND password = p_password;
$$;

CREATE OR REPLACE FUNCTION check_forget_password (
    p_user_name VARCHAR(100),
    p_phone VARCHAR(15)
)
RETURNS SETOF account
LANGUAGE sql
AS $$
    SELECT *
    FROM account
    WHERE is_delete = FALSE
      AND user_name = p_user_name
      AND phone = p_phone;
$$;

-- DROP FUNCTION IF EXISTS get_members(
--     INT,
--     INT,
--     UUID,
--     UUID
-- );
CREATE OR REPLACE FUNCTION get_members (
    p_page INT,
    p_size INT,
    p_account_id UUID,
    p_searched_account_id UUID DEFAULT NULL
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
BEGIN

    SELECT ai.added_by_id
    INTO v_added_by_id
    FROM account_information ai
    WHERE ai.account_id = p_account_id;

    IF v_added_by_id IS NULL THEN
        RETURN QUERY
        SELECT
            '[]'::JSONB,
            0::BIGINT;

        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        COALESCE(
            JSONB_AGG(to_jsonb(x) ORDER BY x.id DESC),
            '[]'::JSONB
        ) AS items,

        COUNT(*)::BIGINT AS total_count

    FROM (
        SELECT a.*
        FROM account a
        JOIN account_information ai
            ON ai.account_id = a.id
        WHERE a.is_delete = FALSE
          AND ai.added_by_id = v_added_by_id
          AND (
              p_searched_account_id IS NULL
              OR a.id = p_searched_account_id
          )
        ORDER BY a.id DESC
        LIMIT p_size
        OFFSET (p_page - 1) * p_size
    ) x;

END;
$$;

CREATE OR REPLACE FUNCTION get_all_members (
    p_added_by_id UUID
)
RETURNS SETOF account
LANGUAGE sql
AS $$
    SELECT a.*
    FROM account a
    JOIN account_information ai
        ON ai.account_id = a.id
    WHERE
        a.is_delete = FALSE
        AND (
            p_added_by_id IS NULL
            OR ai.added_by_id = p_added_by_id
        );
$$;

-- DROP FUNCTION get_account_information(UUID);
CREATE OR REPLACE FUNCTION get_account_information (
    p_id UUID
)
RETURNS SETOF account_information
LANGUAGE sql
AS $$
    SELECT ai.*
    FROM account_information ai
    JOIN account a ON a.id = ai.account_id
    WHERE
        a.is_delete = FALSE
        AND (p_id IS NULL OR ai.account_id = p_id);
$$;
--> chuyen sang dung
CREATE OR REPLACE FUNCTION get_my_account_information (
    p_account_id UUID
)
RETURNS SETOF account_information
LANGUAGE sql
AS $$
    SELECT *
    FROM account_information
    WHERE account_id = p_account_id;
$$;

CREATE OR REPLACE FUNCTION get_me (
    p_id UUID
)
RETURNS SETOF account
LANGUAGE sql
AS $$
    SELECT *
    FROM account
    WHERE is_delete = FALSE
      AND id = p_id;
$$;

CREATE OR REPLACE FUNCTION get_account_with_id (
    p_id UUID
)
RETURNS SETOF account
LANGUAGE sql
AS $$
    SELECT *
    FROM account
    WHERE is_delete = FALSE
      AND id = p_id;
$$;

--  WITH chatRoomRole
CREATE OR REPLACE FUNCTION get_reply_accounts (
    p_page INT,
    p_size INT,
    p_chat_room_id UUID
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE sql
AS $$
    WITH filtered_accounts AS (
        SELECT a.*
        FROM account a
        INNER JOIN chat_room_role crr
            ON crr.authorized_account_id = a.id
        WHERE
            a.is_delete = False
            AND crr.status = 'normal'
            AND crr.chat_room_id = p_chat_room_id
    ),
    counted AS (
        SELECT
            fa.*,
            COUNT(*) OVER () AS total_count
        FROM filtered_accounts fa
    ),
    paginated AS (
        SELECT *
        FROM counted
        ORDER BY
            (
                SELECT string_agg(
                    x.value,
                    ' '
                    ORDER BY x.ordinality DESC
                )
                FROM regexp_split_to_table(
                    trim(last_name),
                    '\s+'
                ) WITH ORDINALITY AS x(value, ordinality)
            ) COLLATE "vi-x-icu",

            (
                SELECT string_agg(
                    x.value,
                    ' '
                    ORDER BY x.ordinality DESC
                )
                FROM regexp_split_to_table(
                    trim(first_name),
                    '\s+'
                ) WITH ORDINALITY AS x(value, ordinality)
            ) COLLATE "vi-x-icu",

            id ASC

        LIMIT p_size
        OFFSET (p_page - 1) * p_size
    )
    SELECT
        COALESCE(
            jsonb_agg(
                to_jsonb(paginated)
                - 'total_count'
                ORDER BY
                    (
                        SELECT string_agg(
                            x.value,
                            ' '
                            ORDER BY x.ordinality DESC
                        )
                        FROM regexp_split_to_table(
                            trim(paginated.last_name),
                            '\s+'
                        ) WITH ORDINALITY AS x(value, ordinality)
                    ),
                    (
                        SELECT string_agg(
                            x.value,
                            ' '
                            ORDER BY x.ordinality DESC
                        )
                        FROM regexp_split_to_table(
                            trim(paginated.first_name),
                            '\s+'
                        ) WITH ORDINALITY AS x(value, ordinality)
                    ),
                    paginated.id ASC
            ),
            '[]'::jsonb
        ) AS items,

        COALESCE(
            MAX(paginated.total_count),
            0
        )::BIGINT AS total_count

    FROM paginated;
$$;

-- DROP FUNCTION IF EXISTS get_not_reply_accounts (
--     INT,
--     INT,
--     UUID,
--     UUID
-- );
CREATE OR REPLACE FUNCTION get_not_reply_accounts (
    p_page INT,
    p_size INT,
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
BEGIN

    -- Lấy added_by_id của account hiện tại
    SELECT ai.added_by_id
    INTO v_added_by_id
    FROM account_information ai
    WHERE ai.account_id = p_account_id;

    RETURN QUERY
    SELECT
        COALESCE(
            JSONB_AGG(
                to_jsonb(x)
                ORDER BY
                    x.last_name_sort,
                    x.first_name_sort,
                    x.id ASC
            ),
            '[]'::JSONB
        ) AS items,

        COUNT(*)::BIGINT AS total_count

    FROM (
        SELECT
            a.id,
            a.user_name,
            a.password,
            a.first_name,
            a.last_name,
            a.is_delete,

            -- Dùng để sort last_name
            (
                SELECT string_agg(
                    s.value,
                    ' '
                    ORDER BY s.ordinal DESC
                )
                FROM regexp_split_to_table(
                    trim(a.last_name),
                    '\s+'
                ) WITH ORDINALITY AS s(value, ordinal)
            ) COLLATE "vi-x-icu" AS last_name_sort,

            -- Dùng để sort first_name
            (
                SELECT string_agg(
                    s.value,
                    ' '
                    ORDER BY s.ordinal DESC
                )
                FROM regexp_split_to_table(
                    trim(a.first_name),
                    '\s+'
                ) WITH ORDINALITY AS s(value, ordinal)
            ) COLLATE "vi-x-icu" AS first_name_sort

        FROM account a

        INNER JOIN account_information ai
            ON ai.account_id = a.id

        LEFT JOIN chat_room_role crr
            ON crr.authorized_account_id = a.id
            AND crr.chat_room_id = p_chat_room_id
            AND crr.status = 'normal'

        WHERE
            a.is_delete = FALSE
            AND ai.added_by_id = v_added_by_id
            AND crr.id IS NULL

        ORDER BY
            last_name_sort,
            first_name_sort,
            a.id ASC

        LIMIT p_size
        OFFSET (p_page - 1) * p_size

    ) x;

END;
$$;

CREATE OR REPLACE FUNCTION get_account_receive_message (
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF account_receive_message
LANGUAGE sql
AS $$
    SELECT *
    FROM account_receive_message
    WHERE account_id = p_account_id
      AND zalo_oa_id = p_zalo_oa_id;
$$;

CREATE OR REPLACE FUNCTION get_my_recommend (
    p_account_id UUID
)
RETURNS SETOF recommend
LANGUAGE sql
AS $$
    SELECT *
    FROM recommend
    WHERE account_id = p_account_id;
$$;

CREATE OR REPLACE FUNCTION get_teams (
    p_admin_account_id UUID,
    p_limit INT DEFAULT 20,
    p_cursor UUID DEFAULT NULL
)
RETURNS TABLE (
    items JSONB,
    next_cursor UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_limit INT;
BEGIN
    v_limit := LEAST(GREATEST(p_limit, 1), 100);

    RETURN QUERY
    WITH data AS (
        SELECT
            t.id,
            t.name,
            t.type,
            t.is_lock,
            t.is_delete,
            t.account_id,
            t.create_time
        FROM team t
        WHERE t.account_id = p_admin_account_id
          AND t.is_delete = FALSE
          AND (
              p_cursor IS NULL
              OR t.id < p_cursor
          )
        ORDER BY t.id DESC
        LIMIT v_limit
    )
    SELECT
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', d.id,
                    'name', d.name,
                    'type', d.type,
                    'is_lock', d.is_lock,
                    'is_delete', d.is_delete,
                    'account_id', d.account_id,
                    'create_time', d.create_time
                )
                ORDER BY d.id DESC
            ),
            '[]'::JSONB
        ) AS items,

        (
            SELECT d2.id
            FROM data d2
            ORDER BY d2.id ASC
            LIMIT 1
        ) AS next_cursor

    FROM data d;
END;
$$;

CREATE OR REPLACE FUNCTION get_team_members (
    p_team_id UUID,
    p_limit INT DEFAULT 20,
    p_cursor UUID DEFAULT NULL
)
RETURNS TABLE (
    items JSONB,
    next_cursor UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_limit INT;
BEGIN
    v_limit := LEAST(GREATEST(p_limit, 1), 100);

    RETURN QUERY
    WITH data AS (
        SELECT
            tm.id,
            tm.team_id,
            tm.account_id,
            tm.role,
            tm.is_lock,
            tm.is_delete,
            tm.create_time
        FROM team_member tm
        WHERE tm.team_id = p_team_id
		  AND tm.role = 'member'
          AND tm.is_delete = FALSE
          AND (
              p_cursor IS NULL
              OR tm.id < p_cursor
          )
        ORDER BY tm.id DESC
        LIMIT v_limit + 1
    ),
    page AS (
        SELECT *
        FROM data
        ORDER BY id DESC
        LIMIT v_limit
    )
    SELECT
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'team_id', team_id,
                    'account_id', account_id,
                    'role', role,
                    'is_lock', is_lock,
                    'is_delete', is_delete,
                    'create_time', create_time
                )
                ORDER BY id DESC
            ),
            '[]'::JSONB
        ) AS items,

        (
            SELECT id
            FROM page
            ORDER BY id ASC
            LIMIT 1
        ) AS next_cursor;
END;
$$;

CREATE OR REPLACE FUNCTION get_team_leader(
    p_team_id UUID
)
RETURNS team_member
LANGUAGE plpgsql
AS $$
DECLARE
    v_team_member team_member;
BEGIN
    SELECT tm.*
    INTO v_team_member
    FROM team_member tm
    WHERE tm.team_id = p_team_id
      AND tm.role = 'leader'
      AND tm.is_delete = FALSE
    LIMIT 1;

    RETURN v_team_member;
END;
$$;

CREATE OR REPLACE FUNCTION get_team_by_id(
    p_id UUID
)
RETURNS team
LANGUAGE plpgsql
AS $$
DECLARE
    v_team team;
BEGIN
    SELECT *
    INTO v_team
    FROM team
    WHERE id = p_id
      AND is_delete = FALSE;

    RETURN v_team;
END;
$$;