CREATE TABLE message (
    id INT PRIMARY KEY IDENTITY(1,1),
	eventName NVARCHAR(255) NOT NULL,
    sender NVARCHAR(255) NOT NULL,
	receiveId NVARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
	type NVARCHAR(255) NOT NULL,
	timestamp NVARCHAR(255) NOT NULL,
	messageStatus NVARCHAR(255) NOT NULL,
    status NVARCHAR(255) NOT NULL,
    accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

    CONSTRAINT FK_message_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_account_id ON message(accountId);
GO
