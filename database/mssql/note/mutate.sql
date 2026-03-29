CREATE PROCEDURE CreateNote
	@note NVARCHAR(MAX),
	@chatRoomId INT,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @newNoteId INT;

		-- Th�m medication
        INSERT INTO dbo.note (note, status, chatRoomId, zaloOaId, accountId, updateTime, createTime)
        VALUES (@note, 'normal', @chatRoomId, @zaloOaId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

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

CREATE PROCEDURE UpdateNote
	@id INT,
	@note NVARCHAR(MAX),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.note
			WHERE 
				id = @id
				AND accountId = @accountId
		)
		BEGIN
			THROW 50002, N'Ghi chú không hợp lệ .', 1;
		END

        UPDATE dbo.note
		SET note = @note
		WHERE 
			status = 'normal'
			AND id = @id

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