CREATE TABLE note (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
    note TEXT NOT NULL,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	chat_room_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_note_chat_room FOREIGN KEY (chat_room_id) REFERENCES chat_room(id)
);
CREATE INDEX idx_note_chat_room_id ON note(chat_room_id);