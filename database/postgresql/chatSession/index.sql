CREATE TABLE chat_session (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    label VARCHAR(255) NOT NULL,
	code VARCHAR(255) NOT NULL,
	is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(255) NOT NULL,
	selected_account_id UUID NOT NULL,
	zalo_oa_id UUID NOT NULL,
	account_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	CONSTRAINT ux_chat_session_account_id_code UNIQUE (account_id, zalo_oa_id, code),
    CONSTRAINT FK_chat_session_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_chat_session_account_id ON chat_session(account_id);
CREATE INDEX idx_chat_session_selected_account_id ON chat_session(selected_account_id);