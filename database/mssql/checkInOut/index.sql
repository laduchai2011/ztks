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