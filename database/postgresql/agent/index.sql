CREATE TABLE agent (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	type VARCHAR(255) NOT NULL,
	expiry TIMESTAMPTZ,
	status VARCHAR(255) NOT NULL,
    agent_account_id UUID,
	account_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_agent_agent_account FOREIGN KEY (agent_account_id) REFERENCES account(id),
	CONSTRAINT FK_agent_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_agent_account_id ON agent(account_id);
CREATE UNIQUE INDEX ux_agent_account_id_agent_account_id ON agent(account_id, agent_account_id) WHERE agent_account_id IS NOT NULL;

CREATE TABLE agent_pay (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
	is_pay BIT NOT NULL,
	agent_id UUID NOT NULL,
	account_id UUID NOT NULL,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT FK_agent_pay_agent FOREIGN KEY (agent_id) REFERENCES agent(id),
	CONSTRAINT FK_agent_pay_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_agent_pay_agent_id ON agent_pay(agent_id);
CREATE INDEX idx_agent_pay_account_id ON agent_pay(account_id);
CREATE UNIQUE INDEX ux_agent_pay_account_id_agent_id_create_time ON agent_pay(account_id, agent_id, create_time DESC);
