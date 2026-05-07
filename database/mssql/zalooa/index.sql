CREATE TABLE zaloApp (
    id INT PRIMARY KEY IDENTITY(1,1),
	label NVARCHAR(255) NOT NULL,
	appId NVARCHAR(255) NOT NULL UNIQUE,
	appName NVARCHAR(255) NOT NULL,
    appSecret NVARCHAR(255) NOT NULL,
    status NVARCHAR(255) NOT NULL,
    accountId INT NOT NULL UNIQUE,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

    CONSTRAINT FK_zaloApp_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_account_id ON zaloApp(accountId);
GO

CREATE TABLE zaloOa (
    id INT PRIMARY KEY IDENTITY(1,1),
	label NVARCHAR(255) NOT NULL,
    oaId NVARCHAR(255) NOT NULL UNIQUE,
	oaName NVARCHAR(255) NOT NULL UNIQUE,
	oaSecret NVARCHAR(255) NOT NULL,
    status NVARCHAR(255) NOT NULL,
	zaloAppId INT NOT NULL,
    accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_zaloOa_ZaloApp FOREIGN KEY (zaloAppId) REFERENCES zaloApp(id),
    CONSTRAINT FK_zaloOa_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_zaloApp_id ON zaloOa(zaloAppId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON zaloOa(accountId);
GO

CREATE TABLE zaloOaToken (
	refreshToken NVARCHAR(MAX) NOT NULL,
	zaloOaId INT NOT NULL UNIQUE,

	CONSTRAINT FK_zaloOaToken_ZaloOa FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id),
)
GO

CREATE TABLE oaPermission (
    id INT PRIMARY KEY IDENTITY(1,1),
	role NVARCHAR(255) NOT NULL,
    status NVARCHAR(255) NOT NULL,
	zaloOaId INT NOT NULL,
    accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_oaPermistion_ZaloOa FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id),
    CONSTRAINT FK_oaPermistion_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_zaloOa_id ON oaPermission(zaloOaId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON oaPermission(accountId);
GO

CREATE TABLE znsTemplate (
    id INT PRIMARY KEY IDENTITY(1,1),
	temId NVARCHAR(255) NOT NULL,
	images NVARCHAR(MAX) NOT NULL,
	dataFields NVARCHAR(MAX) NOT NULL,
	phoneCost DECIMAL(20,2) NOT NULL,
	uidCost DECIMAL(20,2) NOT NULL,
    isDelete BIT NOT NULL DEFAULT 0,
	zaloOaId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_znsTemplate_ZaloOa FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id)
)
GO
CREATE NONCLUSTERED INDEX idx_zaloOa_id ON znsTemplate(zaloOaId);
GO

CREATE TABLE znsMessage (
    id INT PRIMARY KEY IDENTITY(1,1),
	type NVARCHAR(255) NOT NULL,
	data NVARCHAR(MAX) NOT NULL,
	znsTemplateId INT NOT NULL,
	accountId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_znsMessage_ZnsTemplate FOREIGN KEY (znsTemplateId) REFERENCES znsTemplate(id),
	CONSTRAINT FK_znsMessage_Account FOREIGN KEY (accountId) REFERENCES account(id),

	CONSTRAINT checkType_znsMessage CHECK (type IN ('phone', 'uid', 'hashPhone'))
)
GO
CREATE NONCLUSTERED INDEX idx_znsTemplate_id ON znsMessage(znsTemplateId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON znsMessage(accountId);
GO