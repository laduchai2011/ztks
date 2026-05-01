ALTER PROCEDURE CreateNote
	@note NVARCHAR(MAX),
	@chatRoomId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE id = @chatRoomId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'ChatRoom không tồn tại .', 1;
		END

		IF EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE id = @chatRoomId AND status = 'delete' )
		BEGIN
			THROW 50002, N'ChatRoom đã bị xóa .', 2;
		END

		DECLARE @newNoteId INT;

        INSERT INTO dbo.note (note, isDelete, chatRoomId, updateTime, createTime)
        VALUES (@note, 0, @chatRoomId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Thêm ghi chú không thành công .', 3;
        END

		SET @newNoteId = SCOPE_IDENTITY();

		SELECT * FROM dbo.note WHERE id = @newNoteId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE UpdateNote
	@id INT,
	@note NVARCHAR(MAX),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @chatRoomId INT;
		SELECT @chatRoomId = chatRoomId FROM dbo.note WHERE id = @id;
		IF @chatRoomId IS NULL THROW 50001, N'Không tìm thất chatRoomid của note .', 1;

		IF EXISTS ( SELECT 1 FROM dbo.note WHERE id = @id AND isDelete = 1 )
		BEGIN
			THROW 50002, N'Note này đã bị xóa .', 2;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE status = 'normal' AND id = @chatRoomId AND accountId = @accountId )
		BEGIN
			THROW 50003, N'ChatRoom này không phải của bạn .', 3;
		END

        UPDATE dbo.note
		SET note = @note
		WHERE id = @id
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Cập nhật ghi chú không thành công .', 4;
        END

		SELECT * FROM dbo.note WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO


delete dbo.isNewMessage
go
delete dbo.myCustomer
go