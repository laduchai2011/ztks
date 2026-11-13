-- CREATE TABLE kafka_event (
--     id UUID PRIMARY KEY,
	
--     aggregate_id UUID NOT NULL,
-- 	aggregate_type VARCHAR(100) NOT NULL,
--     event_type VARCHAR(100) NOT NULL,
	
--     payload JSONB NOT NULL,
-- 	status VARCHAR(20) NOT NULL DEFAULT 'pending'
--         CHECK (status IN ('pending', 'processing', 'published')),

--     locked_by VARCHAR(100),
--     locked_at TIMESTAMPTZ,

--     retry_count INTEGER NOT NULL DEFAULT 0,
--     next_retry_at TIMESTAMPTZ,

-- 	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     published_at TIMESTAMPTZ NULL
-- );
-- CREATE INDEX idx_kafka_event_unpublished ON kafka_event (created_at, id) WHERE published_at IS NULL;
-- CREATE UNIQUE INDEX uq_kafka_event_order_v1_created ON kafka_event (aggregate_type, aggregate_id) WHERE event_type = 'order_v1_created';

-- CREATE TABLE kafka_event_processed (
--     kafka_event_id UUID PRIMARY KEY,
--     processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

-- 	CONSTRAINT FK_kafka_event_processed_kafka_event FOREIGN KEY (kafka_event_id) REFERENCES kafka_event(id)
-- );


CREATE TABLE kafka_event (
    id UUID PRIMARY KEY DEFAULT uuidv7(),

    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,

    topic VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'processing',
                'published',
                'failed'
            )
        ),

    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 10,

    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    locked_by VARCHAR(100),
    locked_until TIMESTAMPTZ,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE INDEX idx_kafka_event_pending ON kafka_event (next_attempt_at, created_at) WHERE status = 'pending';
CREATE INDEX idx_kafka_event_processing ON kafka_event (locked_until) WHERE status = 'processing';

CREATE TABLE processed_event_kafka (
    consumer_name VARCHAR(100) NOT NULL,
    event_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (consumer_name, event_id)
);