CREATE TABLE pay_hook (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    gateway VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL,
    account_number VARCHAR(255) DEFAULT NULL,
    sub_account VARCHAR(255) DEFAULT NULL,
	code VARCHAR(255) DEFAULT NULL,
	content VARCHAR(255) DEFAULT NULL,
	transfer_type VARCHAR(255) DEFAULT NULL,
	description VARCHAR(255) DEFAULT NULL,
	transfer_amount DECIMAL(20,2) NOT NULL DEFAULT 0.00,
	reference_code VARCHAR(255) DEFAULT NULL,
    accumulated DECIMAL(20,2) NOT NULL DEFAULT 0.00,
	agent_pay_id UUID,
	order_id UUID,
	require_take_money_id UUID,
	wallet_id UUID NOT NULL,

	CONSTRAINT FK_pay_hook_agent_pay FOREIGN KEY (agent_pay_id) REFERENCES agent_pay(id),
	CONSTRAINT FK_pay_hook_order FOREIGN KEY (order_id) REFERENCES orderr(id),
	CONSTRAINT FK_pay_hook_wallet FOREIGN KEY (wallet_id) REFERENCES wallet(id)
);
CREATE INDEX idx_pay_hook_reference_code ON pay_hook(reference_code);
CREATE INDEX idx_pay_hook_agent_pay_id ON pay_hook(agent_pay_id);
CREATE INDEX idx_pay_hook_order_id ON pay_hook(order_id);
CREATE INDEX idx_requireTakeMoney_id ON pay_hook(require_take_money_id);
CREATE INDEX idx_pay_hook_wallet_id ON pay_hook(wallet_id);

-- ALTER TABLE payHook
-- ADD requireTakeMoneyId INT;
