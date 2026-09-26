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

-- DROP FUNCTION IF EXISTS get_agents(INT, INT, INT, UUID, UUID);
CREATE FUNCTION get_agents (
    p_page INT,
    p_size INT,
    p_offset INT,
    p_account_id UUID,
    p_agent_account_id UUID DEFAULT NULL
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
            (
                SELECT jsonb_agg(
                    to_jsonb(a)
                    ORDER BY a.id DESC
                )
                FROM (
                    SELECT
                        agent.id,
                        agent.type,
                        agent.expiry,
                        agent.status,
                        agent.agent_account_id,
                        agent.account_id,
                        agent.update_time,
                        agent.create_time
                    FROM agent
                    WHERE
                        agent.status = 'normal'
                        AND (
                            p_agent_account_id IS NULL
                            OR agent.agent_account_id = p_agent_account_id
                        )
                        AND agent.account_id = p_account_id
                    ORDER BY agent.id DESC
                    OFFSET p_offset + ((p_page - 1) * p_size)
                    LIMIT p_size
                ) AS a
            ),
            '[]'::JSONB
        ) AS items,

        (
            SELECT COUNT(*)
            FROM agent
            WHERE
                agent.status = 'normal'
                AND (
                    p_agent_account_id IS NULL
                    OR agent.agent_account_id = p_agent_account_id
                )
                AND agent.account_id = p_account_id
        ) AS total_count;
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