-- CREATE OR REPLACE FUNCTION create_kafka_event (
--     p_aggregate_id UUID,
--     p_aggregate_type VARCHAR(100),
--     p_event_type VARCHAR(100),
--     p_payload JSONB
-- )
-- RETURNS SETOF kafka_event
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     RETURN QUERY
--     INSERT INTO kafka_event (
--         id,
--         aggregate_id,
--         aggregate_type,
--         event_type,
--         payload
--     )
--     VALUES (
--         uuidv7(),
--         p_aggregate_id,
--         p_aggregate_type,
--         p_event_type,
--         p_payload
--     )
--     RETURNING *;
-- END;
-- $$;

-- CREATE OR REPLACE FUNCTION mark_kafka_event_processed (
--     p_kafka_event_id UUID
-- )
-- RETURNS SETOF kafka_event_processed
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     RETURN QUERY
--     INSERT INTO kafka_event_processed (
--         kafka_event_id
--     )
--     VALUES (
--         p_kafka_event_id
--     )
--     ON CONFLICT (kafka_event_id)
--     DO NOTHING
--     RETURNING *;
-- END;
-- $$;


CREATE OR REPLACE FUNCTION create_kafka_event (
    p_aggregate_id UUID,
    p_aggregate_type VARCHAR,
    p_event_type VARCHAR,
    p_topic VARCHAR,
    p_payload JSONB
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO kafka_event (
        aggregate_id,
        aggregate_type,
        event_type,
        topic,
        payload
    )
    VALUES (
        p_aggregate_id,
        p_aggregate_type,
        p_event_type,
        p_topic,
        p_payload
    )
    RETURNING id INTO v_event_id;

    RETURN v_event_id;
END;
$$;

SELECT *
FROM claim_kafka_events('worker-001', 20, 120);
CREATE OR REPLACE FUNCTION claim_kafka_events (
    p_worker_id VARCHAR,
    p_limit INTEGER DEFAULT 20,
    p_lease_seconds INTEGER DEFAULT 120
)
RETURNS SETOF kafka_event
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_worker_id IS NULL OR LENGTH(TRIM(p_worker_id)) = 0 THEN
        RAISE EXCEPTION 'worker_id is required';
    END IF;

    IF p_limit < 1 OR p_limit > 500 THEN
        RAISE EXCEPTION 'limit must be between 1 and 500';
    END IF;

    IF p_lease_seconds < 1 THEN
        RAISE EXCEPTION 'lease_seconds must be greater than 0';
    END IF;

    RETURN QUERY
    WITH selected AS (
        SELECT e.id
        FROM kafka_event e
        WHERE
            e.attempts < e.max_attempts
            AND (
                (
                    e.status = 'pending'
                    AND e.next_attempt_at <= NOW()
                )
                OR
                (
                    e.status = 'processing'
                    AND e.locked_until <= NOW()
                )
            )
        ORDER BY e.created_at ASC, e.id ASC
        LIMIT p_limit
        FOR UPDATE SKIP LOCKED
    )
    UPDATE kafka_event e
    SET
        status = 'processing',
        locked_by = p_worker_id,
        locked_until = NOW() + (
            p_lease_seconds * INTERVAL '1 second'
        ),
        attempts = e.attempts + 1
    FROM selected s
    WHERE e.id = s.id
    RETURNING e.*;

END;
$$;


CREATE OR REPLACE FUNCTION renew_kafka_event_lease (
    p_event_id UUID,
    p_worker_id VARCHAR,
    p_lease_seconds INTEGER DEFAULT 120
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_updated BOOLEAN;
BEGIN
    IF p_lease_seconds < 1 THEN
        RAISE EXCEPTION 'lease_seconds must be greater than 0';
    END IF;

    UPDATE kafka_event
    SET locked_until = NOW() + (
        p_lease_seconds * INTERVAL '1 second'
    )
    WHERE id = p_event_id
      AND status = 'processing'
      AND locked_by = p_worker_id
      AND locked_until > NOW();

    v_updated := FOUND;

    RETURN v_updated;
END;
$$;

CREATE OR REPLACE FUNCTION mark_kafka_event_published (
    p_event_id UUID,
    p_worker_id VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE kafka_event
    SET
        status = 'published',
        published_at = NOW(),
        locked_by = NULL,
        locked_until = NULL,
        last_error = NULL
    WHERE id = p_event_id
      AND status = 'processing'
      AND locked_by = p_worker_id
      AND locked_until > NOW();

    RETURN FOUND;
END;
$$;


CREATE OR REPLACE FUNCTION retry_kafka_event (
    p_event_id UUID,
    p_worker_id VARCHAR,
    p_error TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_event kafka_event%ROWTYPE;
    v_delay_ms BIGINT;
BEGIN
    SELECT *
    INTO v_event
    FROM kafka_event
    WHERE id = p_event_id
      AND status = 'processing'
      AND locked_by = p_worker_id
      AND locked_until > NOW()
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    IF v_event.attempts >= v_event.max_attempts THEN

        UPDATE kafka_event
        SET
            status = 'failed',
            locked_by = NULL,
            locked_until = NULL,
            last_error = LEFT(p_error, 5000)
        WHERE id = p_event_id;

        RETURN TRUE;
    END IF;

    v_delay_ms := LEAST(
        1000 * POWER(2, v_event.attempts - 1),
        300000
    )::BIGINT + FLOOR(RANDOM() * 1000)::BIGINT;

    UPDATE kafka_event
    SET
        status = 'pending',
        next_attempt_at = NOW() + (
            v_delay_ms * INTERVAL '1 millisecond'
        ),
        locked_by = NULL,
        locked_until = NULL,
        last_error = LEFT(p_error, 5000)
    WHERE id = p_event_id;

    RETURN TRUE;
END;
$$;


CREATE OR REPLACE FUNCTION fail_exhausted_kafka_events ()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE kafka_event
    SET
        status = 'failed',
        locked_by = NULL,
        locked_until = NULL,
        last_error = COALESCE(
            last_error,
            'Maximum retry attempts reached'
        )
    WHERE status = 'processing'
      AND locked_until <= NOW()
      AND attempts >= max_attempts;

    GET DIAGNOSTICS v_count = ROW_COUNT;

    RETURN v_count;
END;
$$;


CREATE OR REPLACE FUNCTION register_processed_kafka_event (
    p_consumer_name VARCHAR,
    p_event_id UUID,
    p_event_type VARCHAR,
    p_topic VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO processed_event_kafka (
        consumer_name,
        event_id,
        event_type,
        topic
    )
    VALUES (
        p_consumer_name,
        p_event_id,
        p_event_type,
        p_topic
    )
    ON CONFLICT (
        consumer_name,
        event_id
    )
    DO NOTHING;

    RETURN FOUND;
END;
$$;