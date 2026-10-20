CREATE TABLE order_v1 (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
	images TEXT[] DEFAULT '{}',
	videos TEXT[] DEFAULT '{}',
    money DECIMAL(20,2) NOT NULL DEFAULT 0.00,
	idempotency_key VARCHAR(255) NOT NULL UNIQUE,

	-- Loại đơn
	type VARCHAR(255) NOT NULL,
	
	-- Trạng thái hiện tại
    status VARCHAR(50) NOT NULL DEFAULT 'created',

    -- Lịch sử trạng thái
    process JSONB NOT NULL DEFAULT '[]'::JSONB,
	
	is_pay BOOLEAN NOT NULL DEFAULT FALSE,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	team_id UUID NOT NULL,
	create_account_id UUID NOT NULL,
	admin_account_id UUID NOT NULL,
	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_order_v1_team FOREIGN KEY (team_id) REFERENCES team(id),
	CONSTRAINT FK_order_v1_create_account FOREIGN KEY (create_account_id) REFERENCES account(id),
	CONSTRAINT FK_order_v1_admin_account FOREIGN KEY (admin_account_id) REFERENCES account(id),
	CONSTRAINT order_v1_type CHECK (type IN (
			'product',
			'service'
		)
	),
	CONSTRAINT order_v1_status CHECK (status IN (
			'creating',
			'created',
			'create_failure',
			'paid',
			'store_receive',
			'waiting_shipping',
			'shipping',
			'completed',
			'cancelled'
		)
	)
);
CREATE INDEX idx_order_v1_admin_phone ON order_v1(admin_account_id, phone);
CREATE INDEX idx_order_v1_admin_create_type_status ON order_v1(admin_account_id, create_account_id, type, status);
CREATE INDEX idx_order_v1_admin_type_status ON order_v1(admin_account_id, type, status);

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