CREATE TABLE kafka_event (
    id UUID PRIMARY KEY,
    aggregate_id UUID NOT NULL,
	aggregate_type VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN (
			'pending',
			'published'
        )
	),
    payload JSONB NOT NULL,
	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL
);
CREATE INDEX idx_kafka_event_unpublished ON kafka_event (created_at, id) WHERE published_at IS NULL;
CREATE UNIQUE INDEX uq_kafka_event_order_v1_created ON kafka_event (aggregate_type, aggregate_id) WHERE event_type = 'order_v1_created';


CREATE TABLE kafka_event_processed (
    kafka_event_id UUID PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	CONSTRAINT FK_kafka_event_processed_kafka_event FOREIGN KEY (kafka_event_id) REFERENCES kafka_event(id)
);