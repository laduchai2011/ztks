CREATE TABLE chatRoom (
    id INT PRIMARY KEY IDENTITY(1,1),
	userIdByApp NVARCHAR(255) NOT NULL,
    status NVARCHAR(255) NOT NULL,
	zaloOaId INT NOT NULL,
	accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,
    
	CONSTRAINT UQ_chatRoom_zaloOaId_userIdByApp UNIQUE (zaloOaId, userIdByApp),
    CONSTRAINT FK_chatRoom_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_account_id ON chatRoom(accountId);
GO

CREATE TABLE chatRoomRole (
	id INT PRIMARY KEY IDENTITY(1,1),
	authorizedAccountId INT NOT NULL,
	backGroundColor NVARCHAR(255),
	isRead BIT NOT NULL,
	isSend BIT NOT NULL,
    status NVARCHAR(255) NOT NULL,
	chatRoomId INT NOT NULL,
	accountId INT NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,
    
	CONSTRAINT FK_chatRoomRole_authorizedAccount FOREIGN KEY (authorizedAccountId) REFERENCES account(id),
	CONSTRAINT UQ_chatRoomRole_chatRoomId_authorizedAccountId UNIQUE (chatRoomId, authorizedAccountId),
	CONSTRAINT FK_chatRoomRole_ChatRoom FOREIGN KEY (chatRoomId) REFERENCES chatRoom(id),
    CONSTRAINT FK_chatRoomRole_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_authorizedAccount_id ON chatRoomRole(authorizedAccountId);
GO
CREATE NONCLUSTERED INDEX idx_chatRoom_id ON chatRoomRole(chatRoomId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON chatRoomRole(accountId);
GO