--BO
CREATE TABLE [statistics] (
	id INT PRIMARY KEY IDENTITY(1,1),
	sales DECIMAL(20,2) NOT NULL, 
	orderAmount INT NOT NULL,
	isDelete BIT NOT NULL DEFAULT 0,
	zaloOaId INT NOT NULL,
	accountId INT NOT NULL,
	ofDay DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT UQ_statistics_accountId_zaloOaId_ofDay UNIQUE (accountId, zaloOaId, ofDay),

	CONSTRAINT FK_statistics_ZaloOaId FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id),
	CONSTRAINT FK_statistics_AccountId FOREIGN KEY (accountId) REFERENCES account(id)
);
GO
CREATE NONCLUSTERED INDEX idx_accountId ON [statistics](accountId);
GO
CREATE INDEX idx_accountId_ofDay ON [statistics](accountId, ofDay);
GO
CREATE INDEX idx_zaloOaId_ofDay ON [statistics](zaloOaId, ofDay);
GO
CREATE INDEX idx_sales ON [statistics](sales);
GO

CREATE TABLE [statisticsOa] (
	id INT PRIMARY KEY IDENTITY(1,1),
	sales DECIMAL(20,2) NOT NULL, 
	orderAmount INT NOT NULL,
	isDelete BIT NOT NULL DEFAULT 0,
	zaloOaId INT NOT NULL,
	ofDay Date NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT UQ_statisticsOa_accountId_zaloOaId_ofDay UNIQUE (zaloOaId, ofDay),

	CONSTRAINT FK_statisticsOa_ZaloOaId FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id)
);
GO

CREATE TABLE [statisticsMemberInOneMonth] (
	id INT PRIMARY KEY IDENTITY(1,1),
	sales DECIMAL(20,2) NOT NULL, 
	orderAmount INT NOT NULL,
	flag NVARCHAR(255) NOT NULL,
	isDelete BIT NOT NULL DEFAULT 0,
	ofMonth DATE NOT NULL,
	zaloOaId INT NOT NULL,
	accountId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT checkFlag_statisticsMemberInOneDay CHECK (flag IN ('old', 'new')),

	CONSTRAINT FK_statisticsMemberInOneMonth_ZaloOaId FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id)
);
GO
CREATE INDEX idx_zaloOaId_ofMonth_sales ON [statisticsMemberInOneMonth](zaloOaId, ofMonth, sales);
GO
CREATE UNIQUE INDEX UX_accountId_flag_new ON dbo.[statisticsMemberInOneMonth](accountId, flag) WHERE flag = 'new';
GO
CREATE INDEX idx_accountId ON [statisticsMemberInOneMonth](accountId);
GO
