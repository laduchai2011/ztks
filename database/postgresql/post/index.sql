CREATE TABLE register_post (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	name VARCHAR(255) NOT NULL,
	type VARCHAR(255) NOT NULL,
	expiry_time TIMESTAMPTZ,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	zalo_oa_id UUID NOT NULL,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_register_post_zalo_oa_id FOREIGN KEY (zalo_oa_id) REFERENCES zalo_oa(id),
	CONSTRAINT FK_register_post_account_id FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT type_register_post CHECK (type IN ('free', 'upgrade'))
);
CREATE INDEX idx_register_post_account_id ON register_post(account_id);

CREATE TABLE post (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	index INT NOT NULL, 
	name VARCHAR(255) NOT NULL,
	type VARCHAR(255) NOT NULL,
	title VARCHAR(255) NOT NULL,
	describe TEXT NOT NULL,
	images TEXT NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT FALSE,
	register_post_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_post_register_post_id FOREIGN KEY (register_post_id) REFERENCES register_post(id),
	CONSTRAINT UQ_post_register_post_id_index UNIQUE(register_post_id, index),
	CONSTRAINT type_post CHECK (type IN ('free', 'upgrade'))
);
CREATE INDEX idx_post_register_post_id ON post(register_post_id);