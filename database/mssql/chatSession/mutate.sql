DELETE FROM dbo.chatSession
GO

ALTER PROCEDURE CreateChatSession
	@label NVARCHAR(255),
	@code NVARCHAR(255),
	@isReady BIT,
	@selectedAccountId INT,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE addedById = @accountId AND accountId = @selectedAccountId
		)
		BEGIN
			THROW 50001, N'Bạn không phải admin của tài khoản này .', 1;
		END

		DECLARE @newChatSessionId INT;

        INSERT INTO dbo.chatSession (label, code, isReady, status, selectedAccountId, zaloOaId, accountId, updateTime, createTime)
        VALUES (@label, @code, @isReady, 'normal', @selectedAccountId, @zaloOaId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật chatSession không thành công.', 2;
        END

		SET @newChatSessionId = SCOPE_IDENTITY();

		SELECT * FROM dbo.chatSession WHERE id = @newChatSessionId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE UpdateSelectedAccountIdOfChatSession
	@id INT,
	@selectedAccountId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE addedById = @accountId AND accountId = @selectedAccountId
		)
		BEGIN
			THROW 50001, N'Bạn không phải admin của tài khoản này .', 1;
		END

		UPDATE dbo.chatSession
		SET selectedAccountId = @selectedAccountId
		WHERE status = 'normal' AND id = @id AND accountId = @accountId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật chatSession không thành công.', 2;
        END

		SELECT * FROM dbo.chatSession WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE UpdateIsReadyOfChatSession
	@id INT,
	@isReady BIT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		UPDATE dbo.chatSession
		SET isReady = @isReady
		WHERE status = 'normal' AND id = @id AND accountId = @accountId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Cập nhật chatSession không thành công.', 1;
        END

		SELECT * FROM dbo.chatSession WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE LeaveAllChatSession
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		UPDATE dbo.chatSession
		SET selectedAccountId = NULL
		WHERE status = 'normal' AND selectedAccountId = @accountId;

		IF NOT EXISTS ( SELECT 1 FROM dbo.chatSession WHERE selectedAccountId = @accountId )
		BEGIN
			SELECT CAST(1 AS BIT) AS success;
		END

		SELECT CAST(0 AS BIT) AS success;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

