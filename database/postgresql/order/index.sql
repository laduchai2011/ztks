CREATE TABLE orderr (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    uuid VARCHAR(255) NOT NULL UNIQUE,
	label VARCHAR(255) NOT NULL,
	content TEXT NOT NULL,
	money DECIMAL(20,2) NOT NULL,
	is_pay BOOLEAN NOT NULL,
	phone VARCHAR(255) NOT NULL,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	chat_room_id UUID NOT NULL,  
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_order_chatroom FOREIGN KEY (chat_room_id) REFERENCES chat_room(id)
);
CREATE INDEX idx_order_chat_room_id ON orderr(chat_room_id);
CREATE INDEX idx_order_chat_room_id_is_pay ON orderr(chat_room_id, is_pay);
CREATE INDEX idx_order_phone ON orderr(phone);

CREATE TABLE order_status (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	type VARCHAR(255) NOT NULL,
	content VARCHAR(255) NOT NULL,
    order_id UUID NOT NULL, 
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_order_status_account FOREIGN KEY (order_id) REFERENCES orderr(id)
);
CREATE INDEX idx_order_id ON order_status(order_id);