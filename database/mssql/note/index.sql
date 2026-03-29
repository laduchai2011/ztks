CREATE TABLE note (
	id INT PRIMARY KEY IDENTITY(1,1),
    note NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(255) NOT NULL,
	chatRoomId INT NOT NULL,
	zaloOaId INT NOT NULL, 
    accountId INT NOT NULL, 
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_note_ChatRoom FOREIGN KEY (chatRoomId) REFERENCES chatRoom(id),
	CONSTRAINT FK_note_ZaloOa FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id),
    CONSTRAINT FK_note_Account FOREIGN KEY (accountId) REFERENCES account(id)
);
GO
CREATE NONCLUSTERED INDEX idx_chatRoom_id ON note(chatRoomId);
GO
CREATE NONCLUSTERED INDEX idx_zaloOa_id ON note(zaloOaId);
GO
CREATE NONCLUSTERED INDEX idx_account_id ON note(accountId);
GO