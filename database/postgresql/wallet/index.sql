CREATE TABLE wallet (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	amount DECIMAL(20,2) NOT NULL, 
	type VARCHAR(8) NOT NULL,
    account_id UUID NOT NULL, 
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT ux_wallet_account_id_type UNIQUE (account_id, type),
    CONSTRAINT FK_wallet_account FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT type_wallet CHECK (type IN ('1', '2'))
);
CREATE INDEX idx_wallet_account_id ON wallet(account_id);

CREATE TABLE require_take_money (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	is_do BOOLEAN NOT NULL DEFAULT FALSE,
	do_time TIMESTAMPTZ,
	amount DECIMAL(20,2) NOT NULL, 
	bank_id UUID NOT NULL,
	wallet_id UUID NOT NULL,
	account_id UUID NOT NULL, 
	member_ztks_id UUID, 
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_require_take_money_bank FOREIGN KEY (bank_id) REFERENCES bank(id),
	CONSTRAINT FK_require_take_money_wallet FOREIGN KEY (wallet_id) REFERENCES wallet(id),
	CONSTRAINT FK_require_take_money_account FOREIGN KEY (account_id) REFERENCES account(id),
	CONSTRAINT FK_require_take_money_member_ztks FOREIGN KEY (member_ztks_id) REFERENCES account(id)
);
CREATE INDEX idx_require_take_money_is_do ON require_take_money(is_do);
CREATE INDEX idx_require_take_money_do_time ON require_take_money(do_time);
CREATE INDEX idx_require_take_money_bank_id ON require_take_money(bank_id);
CREATE INDEX idx_require_take_money_wallet_id ON require_take_money(wallet_id);
CREATE INDEX idx_require_take_money_account_id ON require_take_money(account_id);
CREATE INDEX idx_require_take_money_member_ztks_id ON require_take_money(member_ztks_id);
CREATE INDEX idx_require_take_money_create_ime ON require_take_money(create_time);

CREATE TABLE balance_fluctuation (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	amount DECIMAL(20,2) NOT NULL, 
	type VARCHAR(255) NOT NULL,
	pay_hook_id UUID,
	voucher_id UUID,
	order_id UUID,
	require_take_money_id UUID,
	wallet_id UUID NOT NULL,
	create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_balance_fluctuation_pay_hook FOREIGN KEY (pay_hook_id) REFERENCES pay_hook(id),
	CONSTRAINT FK_balance_fluctuation_voucher FOREIGN KEY (voucher_id) REFERENCES voucher(id),
	CONSTRAINT FK_balance_fluctuation_order FOREIGN KEY (order_id) REFERENCES orderr(id),
	CONSTRAINT FK_balance_fluctuation_require_take_money FOREIGN KEY (require_take_money_id) REFERENCES require_take_money(id),
	CONSTRAINT FK_balance_fluctuation_wallet FOREIGN KEY (wallet_id) REFERENCES wallet(id),

	CONSTRAINT check_type_balance_fluctuation CHECK (type IN ('payOrder', 'payAgent', 'takeMoney', 'costTakeMoney5', 'recommend', 'voucher', 'cost1%'))
);
CREATE INDEX idx_balance_fluctuation_wallet_id ON balance_fluctuation(wallet_id);
CREATE UNIQUE INDEX ux_balance_fluctuation_pay_hook_id ON balance_fluctuation(pay_hook_id) WHERE pay_hook_id IS NOT NULL;
CREATE UNIQUE INDEX ux_balance_fluctuation_voucher_id ON balance_fluctuation(voucher_id) WHERE voucher_id IS NOT NULL;
CREATE UNIQUE INDEX ux_balance_fluctuation_order_id ON balance_fluctuation(order_id) WHERE order_id IS NOT NULL;
CREATE UNIQUE INDEX ux_balance_fluctuation_require_take_money_id ON balance_fluctuation(require_take_money_id) WHERE require_take_money_id IS NOT NULL;
CREATE INDEX idx_balance_fluctuation_create_time ON balance_fluctuation(create_time);
CREATE INDEX idx_balance_fluctuation_wallet_id_create_time ON balance_fluctuation(wallet_id, create_time DESC);