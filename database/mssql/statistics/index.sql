CREATE TABLE [statistics] (
	id INT PRIMARY KEY IDENTITY(1,1),
	sales DECIMAL(20,2) NOT NULL, 
	averageSales DECIMAL(20,2) NOT NULL, 
	orderAmount INT NOT NULL,
	averageOrderAmount FLOAT NOT NULL, 
	mostMoneyOfOrder DECIMAL(20,2) NOT NULL, 
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
