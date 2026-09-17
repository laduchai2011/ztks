CREATE OR REPLACE FUNCTION user_take_room_to_chat (
    p_user_id_by_app VARCHAR(255),
    p_zalo_oa_id UUID
)
RETURNS SETOF chat_room
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT cr.*
    FROM chat_room AS cr
    WHERE cr.status = 'normal'
      AND (p_user_id_by_app IS NULL OR cr.user_id_by_app = p_user_id_by_app)
      AND (p_zalo_oa_id IS NULL OR cr.zalo_oa_id = p_zalo_oa_id);
END;
$$;

-- DROP FUNCTION IF EXISTS get_my_chat_rooms(
--     INT,
--     INT,
--     UUID
-- );
CREATE OR REPLACE FUNCTION get_my_chat_rooms (
    p_page INT,
    p_size INT,
    p_account_id UUID
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN

    RETURN QUERY
    SELECT
        COALESCE(
            JSONB_AGG(
                to_jsonb(x)
                ORDER BY x.id DESC
            ),
            '[]'::JSONB
        ) AS items,

        (
            SELECT COUNT(*)::BIGINT
            FROM chat_room cr
            WHERE cr.account_id = p_account_id
        ) AS total_count

    FROM (
        SELECT cr.*
        FROM chat_room cr
        WHERE cr.account_id = p_account_id
        ORDER BY cr.id DESC
        LIMIT p_size
        OFFSET (p_page - 1) * p_size
    ) x;

END;
$$;

CREATE OR REPLACE FUNCTION get_chat_room_with_id (
    p_id UUID
)
RETURNS SETOF chat_room
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT cr.*
    FROM chat_room AS cr
    WHERE cr.status = 'normal'
      AND (p_id IS NULL OR cr.id = p_id);
END;
$$;

CREATE OR REPLACE FUNCTION get_chat_room_role_with_crid_aaid (
    p_authorized_account_id UUID,
    p_chat_room_id UUID
)
RETURNS SETOF chat_room_role
LANGUAGE sql
AS $$
    SELECT crr.*
    FROM chat_room_role AS crr
    WHERE crr.status = 'normal'
      AND (
          p_authorized_account_id IS NULL
          OR crr.authorized_account_id = p_authorized_account_id
      )
      AND (
          p_chat_room_id IS NULL
          OR crr.chat_room_id = p_chat_room_id
      );
$$;

CREATE OR REPLACE FUNCTION get_all_chat_room_roles_with_chat_room_id (
    p_chat_room_id UUID
)
RETURNS SETOF chat_room_role
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM chat_room_role
    WHERE status = 'normal'
      AND chat_room_id = p_chat_room_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_latest_chat_room_phone (
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_room_phone
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE account_id = p_account_id
          AND id = p_chat_room_id
    ) THEN
        RAISE EXCEPTION 'Không phải chatRoom của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN QUERY
    SELECT *
    FROM chat_room_phone
    WHERE chat_room_id = p_chat_room_id
    ORDER BY id DESC
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION get_list_chat_room_phones(
    p_chat_room_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_room_phone
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM chat_room
        WHERE account_id = p_account_id
          AND id = p_chat_room_id
    ) THEN
        RAISE EXCEPTION 'Không phải chatRoom của bạn.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN QUERY
    SELECT *
    FROM chat_room_phone
    WHERE chat_room_id = p_chat_room_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_all_chat_room_master_members(
    p_chat_room_id UUID
)
RETURNS SETOF chat_room_master_members
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM chat_room_master_members
    WHERE chat_room_id = p_chat_room_id;
END;
$$;