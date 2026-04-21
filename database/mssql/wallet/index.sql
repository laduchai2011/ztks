CREATE TABLE wallet (
    id INT PRIMARY KEY IDENTITY(1,1),
	amount DECIMAL(20,2) NOT NULL, 
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
	amount DECIMAL(20,2) NOT NULL, 
	type VARCHAR(255) NOT NULL,
	payHookId INT,
	voucherId INT,
	orderId INT,
	requireTakeMoneyId INT,
	walletId INT NOT NULL,
	createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_balanceFluctuation_Payhook FOREIGN KEY (payHookId) REFERENCES payHook(id),
	CONSTRAINT FK_balanceFluctuation_Voucher FOREIGN KEY (voucherId) REFERENCES voucher(id),
	CONSTRAINT FK_balanceFluctuation_Order FOREIGN KEY (orderId) REFERENCES [order](id),
	CONSTRAINT FK_balanceFluctuation_RequireTakeMoney FOREIGN KEY (requireTakeMoneyId) REFERENCES requireTakeMoney(id),
	CONSTRAINT FK_balanceFluctuation_Wallet FOREIGN KEY (walletId) REFERENCES wallet(id),

	CONSTRAINT checkType_balanceFluctuation CHECK (type IN ('payOrder', 'payAgent', 'takeMoney', 'costTakeMoney5', 'recommend', 'voucher', 'cost1%'))
)
GO
CREATE NONCLUSTERED INDEX idx_wallet_id ON balanceFluctuation(walletId);
GO
CREATE UNIQUE NONCLUSTERED INDEX idx_balanceFluctuation_payHookId_unique ON balanceFluctuation(payHookId) WHERE payHookId IS NOT NULL;
GO
CREATE UNIQUE NONCLUSTERED INDEX idx_balanceFluctuation_voucherId_unique ON balanceFluctuation(voucherId) WHERE voucherId IS NOT NULL;
GO
CREATE UNIQUE NONCLUSTERED INDEX idx_balanceFluctuation_orderId_unique ON balanceFluctuation(orderId) WHERE orderId IS NOT NULL;
GO
CREATE UNIQUE NONCLUSTERED INDEX idx_balanceFluctuation_requireTakeMoneyId_unique ON balanceFluctuation(requireTakeMoneyId) WHERE requireTakeMoneyId IS NOT NULL;
GO
CREATE NONCLUSTERED INDEX idx_wallet_createTime ON balanceFluctuation(createTime);
GO

-- ALTER TABLE balanceFluctuation
-- ADD requireTakeMoneyId INT;
-- GO
-- ALTER TABLE balanceFluctuation ADD CONSTRAINT FK_balanceFluctuation_RequireTakeMoney FOREIGN KEY (requireTakeMoneyId) REFERENCES requireTakeMoney(id);
-- GO

-- ALTER TABLE balanceFluctuation
-- DROP CONSTRAINT checkType_balanceFluctuation;
-- ALTER TABLE balanceFluctuation
-- ADD CONSTRAINT checkType_balanceFluctuation
-- CHECK (type IN ('payOrder', 'payAgent', 'takeMoney', 'costTakeMoney5', 'recommend', 'voucher', 'cost1%'));

SELECT * 
FROM sys.check_constraints 
WHERE name = 'checkType_balanceFluctuation';

DROP TABLE IF EXISTS balanceFluctuation;
DROP TABLE IF EXISTS wallet;
GO

DECLARE @sql NVARCHAR(MAX);

SELECT @sql = 
    'ALTER TABLE [' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [checkType_wallet]'
FROM sys.check_constraints
WHERE name = 'checkType_wallet';

EXEC(@sql);

CREATE TABLE requireTakeMoney (
	id INT PRIMARY KEY IDENTITY(1,1),
	isDo BIT NOT NULL DEFAULT 0,
	amount DECIMAL(20,2) NOT NULL, 
	bankId INT NOT NULL,
	walletId INT NOT NULL,
	accountId INT NOT NULL, 
	memberZtksId INT, 
	isDelete BIT NOT NULL DEFAULT 0,
	updateTime DATETIMEOFFSET(7) NOT NULL,
	createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_requireTakeMoney_Bank FOREIGN KEY (bankId) REFERENCES bank(id),
	CONSTRAINT FK_requireTakeMoney_Wallet FOREIGN KEY (walletId) REFERENCES wallet(id),
	CONSTRAINT FK_requireTakeMoney_Account FOREIGN KEY (accountId) REFERENCES account(id),
	CONSTRAINT FK_requireTakeMoney_MemberZtks FOREIGN KEY (memberZtksId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_bank_id ON requireTakeMoney(bankId);
GO
CREATE NONCLUSTERED INDEX idx_wallet_id ON requireTakeMoney(walletId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON requireTakeMoney(accountId);
GO
CREATE NONCLUSTERED INDEX idx_memberZtks_id ON requireTakeMoney(memberZtksId);
GO
CREATE NONCLUSTERED INDEX idx_wallet_createTime ON requireTakeMoney(createTime);
GO

-- ALTER TABLE requireTakeMoney
-- ADD memberZtksId INT;
-- GO
-- ALTER TABLE requireTakeMoney ADD CONSTRAINT FK_requireTakeMoney_MemberZtks FOREIGN KEY (memberZtksId) REFERENCES account(id);
-- GO