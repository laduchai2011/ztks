CREATE TABLE chat_room (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	user_id_by_app VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
	zalo_oa_id UUID NOT NULL,
	account_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	CONSTRAINT ux_chat_room_zalo_oa_id_user_id_by_app UNIQUE (zalo_oa_id, user_id_by_app),
    CONSTRAINT FK_chat_room_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_account_id ON chat_room(account_id);

CREATE TABLE chat_room_role (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	authorized_account_id UUID NOT NULL,
	backGround_color VARCHAR(255),
	is_read BOOLEAN NOT NULL,
	is_send BOOLEAN NOT NULL,
    status VARCHAR(255) NOT NULL,
	chat_room_id UUID NOT NULL,
	account_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT ux_chat_room_role_chat_room_id_authorized_account_id UNIQUE (chat_room_id, authorized_account_id),
	CONSTRAINT FK_chat_room_role_authorized_account FOREIGN KEY (authorized_account_id) REFERENCES account(id),
	CONSTRAINT FK_chat_room_role_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_room(id),
    CONSTRAINT FK_chat_room_role_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_chat_room_role_authorized_account_id ON chat_room_role(authorized_account_id);
CREATE INDEX idx_chat_room_role_chatRoom_id ON chat_room_role(chat_room_id);
CREATE INDEX idx_chat_room_role_account_id ON chat_room_role(account_id);

CREATE TABLE chat_room_phone (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	phone VARCHAR(15) NOT NULL,
	chat_room_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	CONSTRAINT FK_chat_room_phone_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_room(id)
);
CREATE INDEX idx_chat_room_id ON chat_room_phone(chat_room_id);

CREATE TABLE chat_room_master_members (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	chat_room_id UUID NOT NULL,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	CONSTRAINT FK_chat_room_master_members_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_room(id),
    CONSTRAINT FK_chat_room_master_members_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_chat_room_master_members_chat_room_id ON chat_room_master_members(chat_room_id);
