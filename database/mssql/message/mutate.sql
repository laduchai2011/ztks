-- bo
CREATE PROCEDURE IsPassSendMessage
	  @zaloAppId INT,
	  @zaloOaId INT,
	  @chatRoomId INT,
	  @accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @accountId_admin INT;
		SELECT @accountId_admin = addedById FROM dbo.accountInformation WHERE accountId = @accountId;
		IF @accountId_admin IS NULL THROW 50001, N'Không tồn tại admin nào', 1;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.zaloApp
			WHERE accountId = @accountId_admin AND id = @zaloAppId
		)
		BEGIN
			THROW 50002, N'Bạn không có quyền trên zaloApp này .', 2;
		END

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.zaloOa
			WHERE accountId = @accountId_admin AND id = @zaloOaId
		)
		BEGIN
			THROW 50003, N'Bạn không có quyền trên zaloOa này .', 3;
		END

		-- check role
		IF NOT EXISTS (
			SELECT 1
			FROM dbo.chatRoomRole
			WHERE authorizedAccountId = @accountId AND chatRoomId = @chatRoomId AND isSend = 1
		)
		BEGIN
			THROW 50004, N'Bạn không có quyền trong phòng chat này .', 4;
		END

		SELECT * FROM dbo.chatRoomRole WHERE authorizedAccountId = @accountId AND chatRoomId = @chatRoomId AND isSend = 1

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO