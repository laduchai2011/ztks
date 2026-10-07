CREATE TABLE product_code (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	name VARCHAR(255) NOT NULL,
	description VARCHAR(255) NOT NULL,
	detail TEXT NOT NULL,
	images TEXT[] DEFAULT '{}',
	videos TEXT[] DEFAULT '{}',
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	
	CONSTRAINT FK_product_account_id FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_product_account_id ON product_code(account_id);

CREATE TABLE product (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	name VARCHAR(255) NOT NULL,
	description VARCHAR(255) NOT NULL,
	detail TEXT NOT NULL,
	quantity_in INTEGER NOT NULL DEFAULT 0,
	quantity_out INTEGER NOT NULL DEFAULT 0,
	images TEXT[] DEFAULT '{}',
	videos TEXT[] DEFAULT '{}',
	is_lock BOOLEAN NOT NULL DEFAULT FALSE,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	store_id UUID NOT NULL,
	product_code_id UUID NOT NULL,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	
	CONSTRAINT FK_product_store_id FOREIGN KEY (store_id) REFERENCES store(id),
	CONSTRAINT FK_product_product_code_id FOREIGN KEY (product_code_id) REFERENCES product_code(id),
	CONSTRAINT FK_product_account_id FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_product_account_id_product_code_id ON product(account_id, product_code_id);

CREATE TABLE product_fluctuation (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	type VARCHAR(255) NOT NULL,
	command VARCHAR(255) NOT NULL,
	quantity INTEGER DEFAULT 0,
	actual_quantity INTEGER DEFAULT 0,
	note VARCHAR(255) NOT NULL,
	images TEXT[] DEFAULT '{}',
	videos TEXT[] DEFAULT '{}',
	is_finish BOOLEAN NOT NULL DEFAULT FALSE,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	re_order_v1_id UUID,
	order_v1_id UUID,
	source_product_id UUID,
	target_product_id UUID,
	source_account_id UUID,
	target_account_id UUID,
	product_id UUID NOT NULL,
	account_id UUID NOT NULL,
	finish_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_product_fluctuation_re_order_v1_id FOREIGN KEY (re_order_v1_id) REFERENCES re_order_v1(id),
	CONSTRAINT FK_product_fluctuation_order_v1_id FOREIGN KEY (order_v1_id) REFERENCES order_v1(id),
	CONSTRAINT FK_product_fluctuation_source_product_id FOREIGN KEY (source_product_id) REFERENCES product(id),
	CONSTRAINT FK_product_fluctuation_target_product_id FOREIGN KEY (target_product_id) REFERENCES product(id),
	CONSTRAINT FK_product_fluctuation_product_id FOREIGN KEY (product_id) REFERENCES product(id),
	CONSTRAINT FK_product_fluctuation_account_id FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT type_product_fluctuation CHECK (type IN ('in', 'out')),
	CONSTRAINT command_product_fluctuation CHECK (type IN ('add_new', 'add_from_other_product', 'sub_to_other_product', 'order', 're_order', 'redundant', 'lose', 'damaged'))
);
CREATE INDEX idx_product_fluctuation_re_order_v1_id ON product_fluctuation(re_order_v1_id);
CREATE INDEX idx_product_fluctuation_order_v1_id ON product_fluctuation(order_v1_id);
CREATE INDEX idx_product_fluctuation_source_product_id ON product_fluctuation(source_product_id);
CREATE INDEX idx_product_fluctuation_target_product_id ON product_fluctuation(target_product_id);
CREATE INDEX idx_product_fluctuation_source_account_id ON product_fluctuation(source_account_id);
CREATE INDEX idx_product_fluctuation_target_account_id ON product_fluctuation(target_account_id);
CREATE INDEX idx_product_fluctuation_product_id ON product_fluctuation(product_id);
CREATE INDEX idx_product_fluctuation_account_id ON product_fluctuation(account_id);

-- ALTER TABLE product_fluctuation
-- DROP CONSTRAINT IF EXISTS command_product_fluctuation;
-- ALTER TABLE product_fluctuation
-- ADD CONSTRAINT command_product_fluctuation
-- CHECK (
--     command IN (
--         'add_new',
--         'add_from_other_product',
--         'sub_to_other_product',
--         'order',
--         're_order',
--         'redundant',
--         'lose',
--         'damaged'
--     )
-- );