CREATE TABLE agent (
    id INT PRIMARY KEY IDENTITY(1,1),
	type NVARCHAR(255) NOT NULL,
	expiry DATETIMEOFFSET(7),
	status NVARCHAR(255) NOT NULL,
    agentAccountId INT,
	accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_agent_AgentAccount FOREIGN KEY (agentAccountId) REFERENCES account(id),
	CONSTRAINT FK_agent_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_account_id ON agent(accountId);
GO
CREATE UNIQUE INDEX UX_agent_agentAccountId ON agent(accountId, agentAccountId) WHERE agentAccountId IS NOT NULL;
GO

CREATE TABLE agentPay (
    id INT PRIMARY KEY IDENTITY(1,1),
	isPay BIT NOT NULL,
	agentId INT NOT NULL,
	accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_agentPay_Agent FOREIGN KEY (agentId) REFERENCES agent(id),
	CONSTRAINT FK_agentPay_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_agent_id ON agentPay(agentId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON agentPay(accountId);
GO
CREATE UNIQUE INDEX UX_agent_createTimeON ON agentPay(accountId, agentId, createTime DESC);
GO
