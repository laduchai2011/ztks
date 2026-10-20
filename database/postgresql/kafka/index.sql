CREATE TABLE outbox_events (
    id UUID PRIMARY KEY,
    aggregate_id UUID NOT NULL,
	aggregate_type VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN (
			'pending',
			'published'
        )
	),
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL
);
CREATE INDEX idx_outbox_unpublished ON outbox_events (created_at, id) WHERE published_at IS NULL;
CREATE UNIQUE INDEX uq_outbox_order_created ON outbox_events (aggregate_type, aggregate_id) WHERE event_type = 'OrderCreated';


CREATE TABLE processed_events (
    event_id UUID PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);