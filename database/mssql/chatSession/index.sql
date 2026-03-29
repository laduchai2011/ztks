CREATE TABLE chatSession (
    id INT PRIMARY KEY IDENTITY(1,1),
    label NVARCHAR(255) NOT NULL,
	code NVARCHAR(255) NOT NULL,
	isReady BIT NOT NULL DEFAULT 0,
    status NVARCHAR(255) NOT NULL,
	selectedAccountId INT NOT NULL,
	zaloOaId INT NOT NULL,
	accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,
    
	CONSTRAINT UQ_chatSession_accountId_code UNIQUE (accountId, zaloOaId, code),
    CONSTRAINT FK_chatSession_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_account_id ON chatSession(accountId);
GO