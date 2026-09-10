CREATE TABLE checkInOut (
    id INT PRIMARY KEY IDENTITY(1,1),
	type NVARCHAR(255) NOT NULL,
	note NVARCHAR(255) NOT NULL,
	image NVARCHAR(255),
	video NVARCHAR(255),
	isDelete BIT NOT NULL DEFAULT 0,
	accountId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_checkInOut_Account FOREIGN KEY (accountId) REFERENCES account(id),

	CONSTRAINT type_checkInOut CHECK (type IN ('in', 'out'))
)
GO
CREATE NONCLUSTERED INDEX idx_accountId_createTime ON checkInOut(accountId, createTime);
GO

CREATE TABLE checkInOutInspect (
	 id INT PRIMARY KEY IDENTITY(1,1),
	 content NVARCHAR(255) NOT NULL,
	 isPass BIT NOT NULL DEFAULT 0,
	 isDelete BIT NOT NULL DEFAULT 0,
	 checkInOutId INT NOT NULL UNIQUE,
	 accountId INT NOT NULL,
	 updateTime DATETIMEOFFSET(7) NOT NULL,
	 createTime DATETIMEOFFSET(7) NOT NULL,

	 CONSTRAINT FK_checkInOutInspect_CheckInOut FOREIGN KEY (checkInOutId) REFERENCES account(id),
	 CONSTRAINT FK_checkInOutInspect_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
Go