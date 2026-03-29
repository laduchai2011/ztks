CREATE TABLE [order] (
    id INT PRIMARY KEY IDENTITY(1,1),
    uuid NVARCHAR(255) NOT NULL UNIQUE,
	label NVARCHAR(255) NOT NULL,
	content NVARCHAR(MAX) NOT NULL,
	money BIGINT NOT NULL,
	isPay BIT NOT NULL,
	phone NVARCHAR(255) NOT NULL,
    status NVARCHAR(255) NOT NULL,
	chatRoomId INT NOT NULL, 
	zaloOaId INT NOT NULL, 
    accountId INT NOT NULL, 
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_order_ChatRoom FOREIGN KEY (chatRoomId) REFERENCES chatRoom(id),
	CONSTRAINT FK_order_ZaloOa FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id),
    CONSTRAINT FK_order_Account FOREIGN KEY (accountId) REFERENCES account(id)
);
GO
CREATE NONCLUSTERED INDEX idx_chatRoom_id ON [order](chatRoomId);
GO
CREATE NONCLUSTERED INDEX idx_zaloOa_id ON [order](zaloOaId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON [order](accountId);
GO

CREATE TABLE orderStatus (
    id INT PRIMARY KEY IDENTITY(1,1),
	type NVARCHAR(255) NOT NULL,
	content NVARCHAR(255) NOT NULL,
    orderId INT NOT NULL, 
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

    CONSTRAINT FK_orderStatus_Account FOREIGN KEY (orderId) REFERENCES [order](id)
);
GO
CREATE NONCLUSTERED INDEX idx_order_id ON orderStatus(orderId);
GO