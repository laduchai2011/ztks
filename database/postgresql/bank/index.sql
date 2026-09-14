CREATE TABLE bank (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	bank_code VARCHAR(255) NOT NULL,
	account_number VARCHAR(255) NOT NULL,
	account_name VARCHAR(255) NOT NULL,
    account_id UUID NOT NULL, 
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_bank_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_bank_account_id ON bank(account_id);