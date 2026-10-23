CREATE OR REPLACE FUNCTION get_unprocessed_kafka_event ()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'items',
        COALESCE(
            jsonb_agg(
                to_jsonb(ke)
                ORDER BY ke.created_at ASC, ke.id ASC
            ),
            '[]'::JSONB
        ),
        'total_count',
        COUNT(*)
    )
    INTO v_result
    FROM kafka_event ke
    WHERE NOT EXISTS (
        SELECT 1
        FROM kafka_event_processed kep
        WHERE kep.kafka_event_id = ke.id
    );

    RETURN v_result;
END;
$$;