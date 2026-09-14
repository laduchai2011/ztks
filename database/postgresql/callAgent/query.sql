CREATE OR REPLACE FUNCTION get_call_agent_with_account_id (
    p_account_id UUID
)
RETURNS SETOF call_agent
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM call_agent
    WHERE is_delete = FALSE
      AND account_id = p_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_agent_code_from_uid (
    p_uid VARCHAR(255)
)
RETURNS VARCHAR(255)
LANGUAGE plpgsql
AS $$
DECLARE
    v_call_agent_id UUID;
    v_agent_code VARCHAR(255);
BEGIN
    SELECT cp.call_agent_id
    INTO v_call_agent_id
    FROM call_permit cp
    WHERE cp.is_delete = FALSE
      AND cp.uid = p_uid;

    SELECT ca.agent_code
    INTO v_agent_code
    FROM call_agent ca
    WHERE ca.id = v_call_agent_id;

    RETURN v_agent_code;
END;
$$;

CREATE OR REPLACE FUNCTION get_trunk_code_from_uid (
    p_uid VARCHAR(255)
)
RETURNS VARCHAR(255)
LANGUAGE plpgsql
AS $$
DECLARE
    v_zalo_trunk_id UUID;
    v_trunk_code VARCHAR(255);
BEGIN
    SELECT cp.zalo_trunk_id
    INTO v_zalo_trunk_id
    FROM call_permit cp
    WHERE cp.is_delete = FALSE
      AND cp.uid = p_uid
    LIMIT 1;

    IF v_zalo_trunk_id IS NULL THEN
        RAISE EXCEPTION 'ZaloTrunk không tồn tại.'
            USING ERRCODE = 'P0003';
    END IF;

    SELECT zt.trunk_code
    INTO v_trunk_code
    FROM zalo_trunk zt
    WHERE zt.id = v_zalo_trunk_id;

    RETURN v_trunk_code;
END;
$$;

CREATE OR REPLACE FUNCTION get_domain_from_uid (
    p_uid VARCHAR(255)
)
RETURNS VARCHAR(255)
LANGUAGE plpgsql
AS $$
DECLARE
    v_zalo_trunk_id UUID;
    v_domain VARCHAR(255);
BEGIN
    SELECT cp.zalo_trunk_id
    INTO v_zalo_trunk_id
    FROM call_permit cp
    WHERE cp.is_delete = FALSE
      AND cp.uid = p_uid
    LIMIT 1;

    IF v_zalo_trunk_id IS NULL THEN
        RAISE EXCEPTION 'ZaloTrunk không tồn tại.'
            USING ERRCODE = 'P0003';
    END IF;

    SELECT zt.domain
    INTO v_domain
    FROM zalo_trunk zt
    WHERE zt.id = v_zalo_trunk_id;

    RETURN v_domain;
END;
$$;

CREATE OR REPLACE FUNCTION get_call_permit_with_uid (
    p_uid VARCHAR(255)
)
RETURNS SETOF call_permit
LANGUAGE sql
AS $$
    SELECT *
    FROM call_permit
    WHERE is_delete = FALSE
      AND uid = p_uid;
$$;