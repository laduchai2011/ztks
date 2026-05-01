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

CREATE PROCEDURE GetMyChatRooms
	@page INT,
    @size INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		-- Tập kết quả 1: dữ liệu phân trang
		;WITH chatRooms AS (
			SELECT cr.*,
				ROW_NUMBER() OVER (ORDER BY cr.id DESC) AS rn
			FROM dbo.chatRoom AS cr
			WHERE accountId = @accountId
		)
		SELECT *
		FROM chatRooms
		WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

		-- Tập kết quả 2: tổng số dòng
		SELECT COUNT(*) AS totalCount
		FROM dbo.chatRoom AS cr
		WHERE accountId = @accountId
		
		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
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