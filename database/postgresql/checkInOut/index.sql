CREATE TABLE check_in_out (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	type VARCHAR(255) NOT NULL,
	note VARCHAR(255) NOT NULL,
	image VARCHAR(255),
	video VARCHAR(255),
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_check_in_out_account FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT type_check_in_out CHECK (type IN ('in', 'out'))
);
CREATE INDEX ux_check_in_out_account_id_create_time ON check_in_out(account_id, create_time);

CREATE TABLE check_in_out_inspect (
	 id UUID PRIMARY KEY DEFAULT uuidv7(),
	 content VARCHAR(255) NOT NULL,
	 is_pass BOOLEAN NOT NULL DEFAULT FALSE,
	 is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	 check_in_out_id UUID NOT NULL UNIQUE,
	 account_id UUID NOT NULL,
	 update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
     create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	 CONSTRAINT FK_check_in_out_inspect_check_in_out FOREIGN KEY (check_in_out_id) REFERENCES account(id),
	 CONSTRAINT FK_check_in_out_inspect_account FOREIGN KEY (account_id) REFERENCES account(id)
);