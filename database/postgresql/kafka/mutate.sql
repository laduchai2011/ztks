CREATE OR REPLACE FUNCTION create_kafka_event (
    p_aggregate_id UUID,
    p_aggregate_type VARCHAR(100),
    p_event_type VARCHAR(100),
    p_payload JSONB
)
RETURNS SETOF kafka_event
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO kafka_event (
        id,
        aggregate_id,
        aggregate_type,
        event_type,
        payload
    )
    VALUES (
        uuidv7(),
        p_aggregate_id,
        p_aggregate_type,
        p_event_type,
        p_payload
    )
    RETURNING *;
END;
$$;


CREATE OR REPLACE FUNCTION mark_kafka_event_processed (
    p_kafka_event_id UUID
)
RETURNS SETOF kafka_event_processed
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO kafka_event_processed (
        kafka_event_id
    )
    VALUES (
        p_kafka_event_id
    )
    ON CONFLICT (kafka_event_id)
    DO NOTHING
    RETURNING *;
END;
$$;