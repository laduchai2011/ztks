DELETE FROM dbo.chatSession
GO

CREATE PROCEDURE CreateChatSession
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
		DECLARE @newChatSessionId INT;

        INSERT INTO dbo.chatSession (label, code, isReady, status, selectedAccountId, zaloOaId, accountId, updateTime, createTime)
        VALUES (@label, @code, @isReady, 'normal', @selectedAccountId, @zaloOaId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

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

CREATE PROCEDURE UpdateSelectedAccountIdOfChatSession
	@id INT,
	@selectedAccountId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @chatSessionId INT;

		UPDATE dbo.chatSession
		SET selectedAccountId = @selectedAccountId
		WHERE 
			status = 'normal'
			AND id = @id
			AND accountId = @accountId;

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
		DECLARE @chatSessionId INT;

		UPDATE dbo.chatSession
		SET isReady = @isReady
		WHERE 
			status = 'normal'
			AND id = @id
			AND accountId = @accountId;

		SELECT * FROM dbo.chatSession WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

