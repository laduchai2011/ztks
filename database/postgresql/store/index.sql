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

CREATE TABLE shop_role (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    type VARCHAR(50) NOT NULL,
	is_lock BOOLEAN NOT NULL DEFAULT FALSE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	shop_id UUID NOT NULL, 
	account_id UUID NOT NULL, 
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_shop_role_shop FOREIGN KEY (shop_id) REFERENCES shop(id),
	CONSTRAINT fk_shop_role_account FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT shop_role_type CHECK (type IN ('sales', 'store'))
);
CREATE UNIQUE INDEX ux_shop_role_shop_account_type ON shop_role(shop_id, account_id, type);

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

CREATE TABLE depot_role (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    type VARCHAR(50) NOT NULL,
	is_lock BOOLEAN NOT NULL DEFAULT FALSE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	depot_id UUID NOT NULL, 
	account_id UUID NOT NULL, 
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_depot_role_depot FOREIGN KEY (depot_id) REFERENCES shop(id),
	CONSTRAINT fk_depot_role_account FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT depot_role_type CHECK (type IN ('sales', 'store'))
);
CREATE UNIQUE INDEX ux_depot_role_depot_account_type ON depot_role(depot_id, account_id, type);

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

CREATE TABLE store_role (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    type VARCHAR(50) NOT NULL,
	is_lock BOOLEAN NOT NULL DEFAULT FALSE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	store_id UUID NOT NULL, 
	account_id UUID NOT NULL, 
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_store_role_store FOREIGN KEY (store_id) REFERENCES shop(id),
	CONSTRAINT fk_store_role_account FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT store_role_type CHECK (type IN ('sales', 'store'))
);
CREATE UNIQUE INDEX ux_store_role_store_account_type ON store_role(store_id, account_id, type);

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