CREATE TABLE order_v1 (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    money DECIMAL(20,2) NOT NULL DEFAULT 0.00,
	phone VARCHAR(255) NOT NULL,
	
	- Trạng thái hiện tại
    status VARCHAR(50) NOT NULL DEFAULT 'created',

    -- Lịch sử trạng thái
    process JSONB NOT NULL DEFAULT '[]'::JSONB,
	
	is_pay BOOLEAN NOT NULL DEFAULT FALSE,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	create_account_id UUID NOT NULL,
	admin_account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_order_v1_account_id FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT order_v1_status CHECK (status IN (
			'created',
			'paid',
			'waiting_shipping',
			'shipping',
			'delivered',
			'completed',
			'cancelled'
		)
	)
);
CREATE INDEX idx_order_v1_phone ON order_v1(phone);
CREATE INDEX idx_order_v1_account_phone ON order_v1(account_id, phone);
CREATE INDEX idx_order_v1_account_status ON order_v1(account_id, status);

CREATE TABLE re_order_v1 (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    money DECIMAL(20,2) NOT NULL DEFAULT 0.00,
	phone VARCHAR(255) NOT NULL,
	
	- Trạng thái hiện tại
    status VARCHAR(50) NOT NULL DEFAULT 'created',

    -- Lịch sử trạng thái
    process JSONB NOT NULL DEFAULT '[]'::JSONB,
	
	is_pay BOOLEAN NOT NULL DEFAULT FALSE,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	root_order_v1 UUID NOT NULL,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_re_order_v1_account_id FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT FK_re_order_v1_account_id FOREIGN KEY (root_order_v1) REFERENCES order_v1(id),
	CONSTRAINT re_re_order_v1_status CHECK (status IN (
			'created',
			'paid',
			'waiting_shipping',
			'shipping',
			'delivered',
			'completed',
			'cancelled'
		)
	)
);
CREATE INDEX idx_re_order_v1_phone ON re_order_v1(phone);
CREATE INDEX idx_re_order_v1_account_id_phone ON re_order_v1(account_id, phone);
CREATE INDEX idx_re_order_v1_account_status ON order_v1(account_id, status);