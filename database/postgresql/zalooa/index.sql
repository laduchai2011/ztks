CREATE TABLE zalo_app (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	label VARCHAR(255) NOT NULL,
	app_id VARCHAR(255) NOT NULL UNIQUE,
	app_name VARCHAR(255) NOT NULL,
    app_secret VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    account_id UUID NOT NULL UNIQUE,
  	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_zalo_app_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_zalo_app_account_id ON zalo_app(account_id);

CREATE TABLE zalo_oa (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	label VARCHAR(255) NOT NULL,
    oa_id VARCHAR(255) NOT NULL UNIQUE,
	oa_name VARCHAR(255) NOT NULL UNIQUE,
	oa_secret VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
	zalo_app_id UUID NOT NULL,
    account_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_zalo_oa_zalo_app FOREIGN KEY (zalo_app_id) REFERENCES zalo_app(id),
    CONSTRAINT FK_zalo_oa_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_zalo_oa_zalo_app_id ON zalo_oa(zalo_app_id);
CREATE INDEX idx_zalo_oa_account_id ON zalo_oa(account_id);

CREATE TABLE zalo_oa_token (
	refresh_token TEXT NOT NULL,
	zalo_oa_id UUID NOT NULL UNIQUE,

	CONSTRAINT FK_zalo_oa_token_zalo_oa FOREIGN KEY (zalo_oa_id) REFERENCES zalo_oa(id)
);

CREATE TABLE oa_permission (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	role VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
	zalo_oa_id UUID NOT NULL,
    account_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_oa_permistion_zalo_oa FOREIGN KEY (zalo_oa_id) REFERENCES zalo_oa(id),
    CONSTRAINT FK_oa_permistion_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_oa_permission_zalo_oa_id ON oa_permission(zalo_oa_id);
CREATE INDEX idx_oa_permission_account_id ON oa_permission(account_id);

CREATE TABLE zns_template (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	tem_id VARCHAR(255) NOT NULL,
	images TEXT NOT NULL,
	data_fields TEXT NOT NULL,
	phone_cost DECIMAL(20,2) NOT NULL,
	uid_cost DECIMAL(20,2) NOT NULL,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	zalo_oa_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_zns_template_zalo_oa FOREIGN KEY (zalo_oa_id) REFERENCES zalo_oa(id)
);
CREATE INDEX idx_zns_template_zalo_oa_id ON zns_template(zalo_oa_id);

CREATE TABLE zns_message (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	type VARCHAR(255) NOT NULL,
	data TEXT NOT NULL,
	cost DECIMAL(20,2) NOT NULL,
	zns_template_id UUID NOT NULL,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_zns_message_zns_template FOREIGN KEY (zns_template_id) REFERENCES zns_template(id),
	CONSTRAINT FK_zns_message_account FOREIGN KEY (account_id) REFERENCES account(id),

	CONSTRAINT check_type_zns_message CHECK (type IN ('phone', 'uid', 'hashPhone'))
);
CREATE INDEX idx_zns_message_zns_template_id ON zns_message(zns_template_id);
CREATE INDEX idx_zns_message_account_id ON zns_message(account_id);