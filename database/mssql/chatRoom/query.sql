CREATE PROCEDURE UserTakeRoomToChat
	@userIdByApp NVARCHAR(255),
	@zaloOaId INT
AS
BEGIN
	
    SELECT * FROM dbo.chatRoom AS cr
	WHERE status = 'normal' 
		AND (@userIdByApp IS NULL OR cr.userIdByApp = @userIdByApp)
		AND (@zaloOaId IS NULL OR cr.zaloOaId = @zaloOaId) 
END
GO

CREATE PROCEDURE GetAllMyChatRooms
	@accountId INT
AS
BEGIN
    SELECT * FROM dbo.chatRoom 
	WHERE status = 'normal' AND accountId = @accountId
END
GO

CREATE PROCEDURE GetChatRoomWithId
	@id INT
AS
BEGIN
    SELECT * FROM dbo.chatRoom AS cr
	WHERE status = 'normal' 
		AND (@id IS NULL OR cr.id = @id)
END
GO

CREATE PROCEDURE GetChatRoomRoleWithCridAaid
	@authorizedAccountId INT,
	@chatRoomId INT
AS
BEGIN
    SELECT * FROM dbo.chatRoomRole AS crr
	WHERE status = 'normal' 
		AND (@authorizedAccountId IS NULL OR crr.authorizedAccountId = @authorizedAccountId)
		AND (@chatRoomId IS NULL OR crr.chatRoomId = @chatRoomId)
END
GO

CREATE PROCEDURE GetAllChatRoomRolesWithChatRoomId
	@chatRoomId INT
AS
BEGIN
    SELECT * FROM dbo.chatRoomRole WHERE status = 'normal' AND chatRoomId = @chatRoomId
END
GO