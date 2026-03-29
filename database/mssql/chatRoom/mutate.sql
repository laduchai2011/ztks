CREATE PROCEDURE CreateChatRoom
	@userIdByApp NVARCHAR(255),
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @newChatRoomId INT;

        INSERT INTO dbo.chatRoom (userIdByApp, status, zaloOaId, accountId, updateTime, createTime)
        VALUES (@userIdByApp, 'normal', @zaloOaId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SET @newChatRoomId = SCOPE_IDENTITY();

		INSERT INTO dbo.chatRoomRole (authorizedAccountId, isRead, isSend, status, chatRoomId, accountId, updateTime, createTime)
        VALUES (@accountId, 1, 1, 'normal', @newChatRoomId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SELECT * FROM dbo.chatRoom WHERE id = @newChatRoomId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO


DELETE FROM dbo.chatRoomRole 
GO
DELETE FROM dbo.[order]
GO
DELETE FROM dbo.chatRoom
GO

CREATE PROCEDURE UpdateSetupChatRoomRole
	@id INT,
	@backGroundColor NVARCHAR(255),
	@isRead BIT,
	@isSend BIT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		UPDATE dbo.chatRoomRole
		SET backGroundColor = @backGroundColor,
			isRead = @isRead,
			isSend = @isSend
		WHERE id = @id and accountId = @accountId;

		SELECT * FROM dbo.chatRoomRole WHERE id = @id AND accountId = @accountId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

-- ALTER PROCEDURE CreateChatRoomRole
-- 	@authorizedAccountId NVARCHAR(255),
-- 	@chatRoomId INT,
-- 	@accountId INT
-- AS
-- BEGIN
-- 	SET NOCOUNT ON;

-- 	BEGIN TRY
-- 		BEGIN TRANSACTION;

-- 		-- 1) Check chatRoom có tồn tại không
-- 		IF NOT EXISTS (
-- 			SELECT 1
-- 			FROM dbo.chatRoom
-- 			WHERE 
-- 				id = @chatRoomId
-- 				AND accountId = @accountId
-- 		)
-- 		BEGIN
-- 			THROW 50001, N'ChatRoom không tồn tại hoặc đã bị khóa.', 1;
-- 		END

-- 		-- 2) Check đã tồn tại role chưa (tránh insert trùng)
-- 		IF EXISTS (
-- 			SELECT 1
-- 			FROM dbo.chatRoomRole
-- 			WHERE 
-- 				chatRoomId = @chatRoomId
-- 				AND authorizedAccountId = @authorizedAccountId
-- 		)
-- 		BEGIN
-- 			THROW 50002, N'Role này đã tồn tại trong chatRoom.', 1;
-- 		END

-- 		-- 3) Nếu pass hết check thì mới INSERT
-- 		INSERT INTO dbo.chatRoomRole
-- 			(authorizedAccountId, isRead, isSend, status, chatRoomId, accountId, updateTime, createTime)
-- 		VALUES
-- 			(@authorizedAccountId, 1, 1, 'normal', @chatRoomId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

-- 		-- 4) Trả kết quả mới insert
-- 		SELECT *
-- 		FROM dbo.chatRoomRole
-- 		WHERE 
-- 			chatRoomId = @chatRoomId
-- 			AND authorizedAccountId = @authorizedAccountId

-- 		COMMIT TRANSACTION;
-- 	END TRY
-- 	BEGIN CATCH
-- 		IF @@TRANCOUNT > 0
-- 			ROLLBACK TRANSACTION;
-- 		THROW;
-- 	END CATCH
-- END;
-- GO