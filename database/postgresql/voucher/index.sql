CREATE TABLE voucher (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	is_used BOOLEAN NOT NULL,
	time_expire TIMESTAMPTZ NOT NULL,
	money DECIMAL(20,2) NOT NULL,
	order_id UUID, 
	member_ztks_id UUID NOT NULL,
	phone VARCHAR(255) NOT NULL,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_voucher_order FOREIGN KEY (order_id) REFERENCES orderr(id),
	CONSTRAINT FK_voucher_member_ztks_id FOREIGN KEY (member_ztks_id) REFERENCES account(id)
);
CREATE INDEX idx_voucher_phone ON voucher(phone);
CREATE UNIQUE INDEX ux_voucher_order_id ON voucher(order_id) WHERE order_id IS NOT NULL;