CREATE TABLE wallet (
    id INT PRIMARY KEY IDENTITY(1,1),
	amount BIGINT NOT NULL, 
	type VARCHAR(8) NOT NULL,
    accountId INT NOT NULL, 
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT UQ_wallet_accountId_type UNIQUE (accountId, type),
    CONSTRAINT FK_wallet_Account FOREIGN KEY (accountId) REFERENCES account(id),

	CONSTRAINT checkType_wallet CHECK (type IN ('1', '2'))
);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON wallet(accountId);
GO

CREATE TABLE balanceFluctuation (
	id INT PRIMARY KEY IDENTITY(1,1),
	amount BIGINT NOT NULL, 
	type VARCHAR(255) NOT NULL,
	payHookId INT,
	walletId INT NOT NULL,
	createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_balanceFluctuation_Payhook FOREIGN KEY (payHookId) REFERENCES payHook(id),
	CONSTRAINT FK_balanceFluctuation_Wallet FOREIGN KEY (walletId) REFERENCES wallet(id),

	CONSTRAINT checkType_balanceFluctuation CHECK (type IN ('payOrder', 'payAgent', 'takeMoney', 'recommend'))
)
GO
CREATE NONCLUSTERED INDEX idx_wallet_id ON balanceFluctuation(walletId);
GO
CREATE UNIQUE NONCLUSTERED INDEX idx_balanceFluctuation_payHookId_unique ON balanceFluctuation(payHookId) WHERE payHookId IS NOT NULL;
GO
CREATE NONCLUSTERED INDEX idx_wallet_createTime ON balanceFluctuation(createTime);
GO

-- ALTER TABLE balanceFluctuation
-- DROP CONSTRAINT checkType_balanceFluctuation;
-- ALTER TABLE balanceFluctuation
-- ADD CONSTRAINT checkType_balanceFluctuation
-- CHECK (type IN ('payOrder', 'payAgent', 'takeMoney', 'recommend'));
