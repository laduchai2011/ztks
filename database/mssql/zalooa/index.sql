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

	CONSTRAINT FK_oaPermistion_ZaloApp FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id),
    CONSTRAINT FK_oaPermistion_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_zaloApp_id ON oaPermission(zaloOaId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON oaPermission(accountId);
GO