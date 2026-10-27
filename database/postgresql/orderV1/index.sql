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
    status VARCHAR(50) NOT NULL DEFAULT 'creating',

    -- Lịch sử trạng thái
    process TEXT[] NOT NULL DEFAULT ARRAY['creating']::TEXT[],
	
	is_pay BOOLEAN NOT NULL DEFAULT FALSE,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	
	sales_team_id UUID NOT NULL,
	store_team_id UUID,
	customer_v1_id UUID,
	created_account_id UUID NOT NULL,
	received_account_id UUID,
	admin_account_id UUID NOT NULL,
	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_order_v1_sales_team FOREIGN KEY (sales_team_id) REFERENCES team(id),
	CONSTRAINT FK_order_v1_store_team FOREIGN KEY (store_team_id) REFERENCES team(id),
	CONSTRAINT FK_order_v1_customer_v1 FOREIGN KEY (customer_v1_id) REFERENCES customer_v1(id),
	CONSTRAINT FK_order_v1_created_account FOREIGN KEY (created_account_id) REFERENCES account(id),
	CONSTRAINT FK_order_v1_received_account FOREIGN KEY (received_account_id) REFERENCES account(id),
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
	),
	CONSTRAINT uq_order_v1_create_account_idempotency_key UNIQUE (created_account_id, idempotency_key)
);
CREATE INDEX idx_order_v1_admin_type_status_created ON order_v1(admin_account_id, type, status, created_account_id);
CREATE INDEX idx_order_v1_admin_custome_v1_created ON order_v1(admin_account_id, customer_v1_id, created_account_id);

CREATE TABLE order_v1_inventory_reservation (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    order_v1_id UUID NOT NULL REFERENCES order_v1(id),
    product_id UUID NOT NULL REFERENCES product(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'reserved'
        CHECK (
            status IN (
                'reserved',
                'confirmed',
                'released',
                'expired'
            )
        ),
	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	-- CONSTRAINT FK_order_v1_inventory_reservation_order_v1 FOREIGN KEY (order_v1_id) REFERENCES order_v1(id),
	-- CONSTRAINT FK_order_v1_inventory_reservation_product FOREIGN KEY (product_id) REFERENCES product(id),

    CONSTRAINT uq_order_v1_inventory_reservation_order_product UNIQUE (order_v1_id, product_id)
);
CREATE INDEX idx_order_v1_inventory_reservation_product_status ON order_v1_inventory_reservation(product_id, status);

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