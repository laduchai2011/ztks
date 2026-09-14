CREATE OR REPLACE FUNCTION signin (
    p_user_name VARCHAR(100),
    p_password VARCHAR(100)
)
RETURNS SETOF account
LANGUAGE sql
AS $$
    SELECT *
    FROM account
    WHERE user_name = p_user_name
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
    WHERE status = 'normal'
      AND user_name = p_user_name
      AND phone = p_phone;
$$;

CREATE OR REPLACE FUNCTION get_members (
    p_page INT,
    p_size INT,
    p_searched_account_id INT DEFAULT NULL,
    p_account_id UUID
)
RETURNS TABLE (
    account_data account,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id UUID;
BEGIN
    SELECT ai.addedbyid
    INTO v_added_by_id
    FROM accountinformation ai
    WHERE ai.accountid = p_account_id;

    IF v_added_by_id IS NOT NULL THEN

        RETURN QUERY
        SELECT
            a,
            COUNT(*) OVER () AS total_count
        FROM account a
        JOIN accountinformation ai
            ON ai.accountid = a.id
        WHERE a.status = 'normal'
          AND ai.addedbyid = v_added_by_id
          AND (
              p_searched_account_id IS NULL
              OR a.id = p_searched_account_id
          )
        ORDER BY a.id DESC
        LIMIT p_size
        OFFSET (p_page - 1) * p_size;

    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_all_members (
    p_added_by_id UUID DEFAULT NULL
)
RETURNS SETOF account
LANGUAGE sql
AS $$
    SELECT a.*
    FROM account a
    JOIN account_information ai
        ON ai.account_id = a.id
    WHERE
        a.status = 'normal'
        AND (
            p_added_by_id IS NULL
            OR ai.added_by_id = p_added_by_id
        );
$$;

CREATE OR REPLACE FUNCTION get_account_information (
    p_id UUID DEFAULT NULL
)
RETURNS SETOF account_information
LANGUAGE sql
AS $$
    SELECT ai.*
    FROM account_information ai
    JOIN account a ON a.id = ai.account_id
    WHERE
        a.status = 'normal'
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
    WHERE status = 'normal'
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
    WHERE status = 'normal'
      AND id = p_id;
$$;

--  WITH chatRoomRole
CREATE OR REPLACE FUNCTION get_reply_accounts (
    p_page INT,
    p_size INT,
    p_chat_room_id UUID
)
RETURNS TABLE (
    data JSONB,
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
            a.status = 'normal'
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
            ),
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
            ),
            id ASC
        OFFSET (p_page - 1) * p_size
        LIMIT p_size
    )
    SELECT
        COALESCE(
            jsonb_agg(
                to_jsonb(paginated)
                - 'total_count'
            ),
            '[]'::jsonb
        ) AS data,
        COALESCE(
            MAX(paginated.total_count),
            0
        ) AS total_count
    FROM paginated;
$$;

CREATE OR REPLACE FUNCTION get_not_reply_accounts (
    p_page INT,
    p_size INT,
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    -- Các column của account
    id UUID,
    user_name VARCHAR,
    password VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    status VARCHAR,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_added_by_id INT;
BEGIN
    -- Lấy addedById của account hiện tại
    SELECT ai.added_by_id
    INTO v_added_by_id
    FROM account_information ai
    WHERE ai.account_id = p_account_id;

    RETURN QUERY
    SELECT
        a.id,
        a.user_name,
        a.password,
        a.first_name,
        a.last_name,
        a.status,
        COUNT(*) OVER () AS total_count
    FROM account a
    INNER JOIN account_information ai
        ON ai.account_id = a.id
    LEFT JOIN chat_room_role crr
        ON crr.authorized_account_id = a.id
        AND crr.chat_room_id = p_chat_room_id
        AND crr.status = 'normal'
    WHERE
        a.status = 'normal'
        AND ai.added_by_id = v_added_by_id
        AND crr.id IS NULL
    ORDER BY
        -- lastName
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
        ) COLLATE "vi-x-icu",

        -- firstName
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
        ) COLLATE "vi-x-icu",

        a.id ASC

    OFFSET (p_page - 1) * p_size
    LIMIT p_size;

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