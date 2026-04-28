ALTER PROCEDURE CreateChatRoom
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
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo chatRoom không thành công.', 1;
        END

		SET @newChatRoomId = SCOPE_IDENTITY();

		INSERT INTO dbo.chatRoomRole (authorizedAccountId, isRead, isSend, status, chatRoomId, accountId, updateTime, createTime)
        VALUES (@accountId, 1, 1, 'normal', @newChatRoomId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo chatRoomRole không thành công.', 2;
        END

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
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Cập nhật chatRoomRole không thành công.', 1;
        END

		SELECT * FROM dbo.chatRoomRole WHERE id = @id AND accountId = @accountId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE ChangeChatRoomMaster
	@chatRoomId INT,
	@newAccountId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE accountId = @accountId AND id = @chatRoomId )
		BEGIN
			THROW 50001, N'Không phải chatRoom của bạn .', 1;
		END

		UPDATE dbo.chatRoom
		SET accountId = @newAccountId
		WHERE id = @chatRoomId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật chatRoom không thành công.', 2;
        END

		DELETE FROM dbo.chatRoomRole
		WHERE chatRoomId = @chatRoomId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Xóa chatRoomRole không thành công.', 3;
        END

		INSERT INTO dbo.chatRoomRole (authorizedAccountId, isRead, isSend, status, chatRoomId, accountId, updateTime, createTime)
        VALUES (@newAccountId, 1, 1, 'normal', @chatRoomId, @newAccountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Tạo chatRoomRole không thành công.', 4;
        END

		SELECT * FROM dbo.chatRoom WHERE id = @chatRoomId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO