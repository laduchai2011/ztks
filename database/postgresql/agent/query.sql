CREATE OR REPLACE FUNCTION get_agent_with_id (
    p_id UUID
)
RETURNS SETOF agent
LANGUAGE sql
AS $$
    SELECT *
    FROM agent
    WHERE status = 'normal'
      AND id = p_id;
$$;

CREATE OR REPLACE FUNCTION get_agents (
    p_page INT,
    p_size INT,
    p_offset INT,
    p_account_id UUID,
	p_agent_account_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    agent_account_id UUID,
    account_id UUID,
    status VARCHAR,
    rn BIGINT,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.*,
        ROW_NUMBER() OVER (ORDER BY a.id DESC) AS rn,
        COUNT(*) OVER () AS total_count
    FROM agent AS a
    WHERE
        a.status = 'normal'
        AND (
            p_agent_account_id IS NULL
            OR a.agent_account_id = p_agent_account_id
        )
        AND a.account_id = p_account_id
    ORDER BY a.id DESC
    OFFSET p_offset + ((p_page - 1) * p_size)
    LIMIT p_size;
END;
$$;

CREATE OR REPLACE FUNCTION get_agent_with_agent_account_id (
    p_agent_account_id UUID
)
RETURNS SETOF agent
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM agent
    WHERE status = 'normal'
      AND agent_account_id = p_agent_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_last_agent_pay (
    p_agent_id UUID,
    p_account_id UUID
)
RETURNS SETOF agent_pay
LANGUAGE sql
AS $$
    SELECT *
    FROM agent_pay
    WHERE agent_id = p_agent_id
      AND account_id = p_account_id
    ORDER BY create_time DESC
    LIMIT 1;
$$;