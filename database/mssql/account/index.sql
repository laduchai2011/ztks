CREATE TABLE account (
    id INT PRIMARY KEY IDENTITY(1,1),
    userName NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(100) NOT NULL,
    phone NVARCHAR(15) NOT NULL UNIQUE,
    firstName NVARCHAR(20) NOT NULL,
    lastName NVARCHAR(20) NOT NULL,
    avatar NVARCHAR(255),
    status NVARCHAR(255) NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    createTime DATETIMEOFFSET(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
);
GO
CREATE NONCLUSTERED INDEX idx_id ON account(id);
GO
CREATE NONCLUSTERED INDEX idx_userName ON account(userName);
GO
CREATE NONCLUSTERED INDEX idx_phone ON account(phone);
GO


CREATE TABLE accountInformation (
    addedById INT,
    accountType NVARCHAR(255) NOT NULL,
	accountId INT NOT NULL UNIQUE,
	
	CONSTRAINT FK_accountInformation_AddedBy FOREIGN KEY (addedById) REFERENCES account(id),
	CONSTRAINT FK_accountInformation_Account FOREIGN KEY (accountId) REFERENCES account(id),

	CONSTRAINT checkType_wallet CHECK (accountType IN ('admin', 'member', 'adminZtks', 'memberZtks'))
);
GO
CREATE NONCLUSTERED INDEX idx_addedById ON accountInformation(addedById);
GO

CREATE TABLE accountReceiveMessage (
    accountIdReceiveMessage INT,
	zaloOaId INT NOT NULL,
	accountId INT NOT NULL,

	CONSTRAINT FK_accountReceiveMessage_accountIdReceiveMessage FOREIGN KEY (accountIdReceiveMessage) REFERENCES account(id),
	CONSTRAINT UQ_accountReceiveMessage_accountId_zaloOaId UNIQUE (accountId, zaloOaId),
	CONSTRAINT FK_accountReceiveMessage_Account FOREIGN KEY (accountId) REFERENCES account(id)
);
GO

CREATE TABLE recommend (
    myCode VARCHAR(255) NOT NULL UNIQUE,
	yourCode VARCHAR(255),
	accountId INT NOT NULL UNIQUE,

	CONSTRAINT FK_recommend_Account FOREIGN KEY (accountId) REFERENCES account(id)
);
GO
CREATE UNIQUE NONCLUSTERED INDEX idx_recommend_yourCode_unique ON recommend(yourCode) WHERE yourCode IS NOT NULL;
GO