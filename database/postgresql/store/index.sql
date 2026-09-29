CREATE TABLE shop (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(50) NOT NULL,
	description VARCHAR(255) NOT NULL,
	content TEXT NOT NULL,
	address VARCHAR(255) NOT NULL,
	phone VARCHAR(255) NOT NULL,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	account_id UUID NOT NULL, 
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_shop_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_shop_account_id ON shop(account_id);
CREATE INDEX idx_shop_account_id_id ON shop(account_id, id DESC);

CREATE TABLE depot (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(50) NOT NULL,
	description VARCHAR(255) NOT NULL,
	content TEXT NOT NULL,
	address VARCHAR(255) NOT NULL,
	phone VARCHAR(255) NOT NULL,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	shop_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_depot_shop FOREIGN KEY (shop_id) REFERENCES shop(id)
);
CREATE INDEX idx_depot_shop_id ON depot(shop_id);
CREATE INDEX idx_depot_shop_id_id ON depot(shop_id, id DESC);

CREATE TABLE store (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(50) NOT NULL,
	description VARCHAR(255) NOT NULL,
	content TEXT NOT NULL,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	depot_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_store_depot FOREIGN KEY (depot_id) REFERENCES depot(id)
);
CREATE INDEX idx_store_depot_id ON store(depot_id);
CREATE INDEX idx_store_depot_id_id ON store(depot_id, id DESC);

CREATE TABLE shop_pay (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	expiry TIMESTAMPTZ,
	money DECIMAL(20,2) NOT NULL DEFAULT 0.00,
	pay_hook_id UUID, 
	shop_id UUID NOT NULL, 
	account_id UUID NOT NULL, 
	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_shop_pay_pay_hook_ FOREIGN KEY (pay_hook_id) REFERENCES pay_hook(id),
	CONSTRAINT fk_shop_pay_shop FOREIGN KEY (shop_id) REFERENCES shop(id),
	CONSTRAINT fk_shop_pay_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_shop_pay_account_id_shop_id_create_time ON shop_pay(account_id, shop_id, create_time DESC);