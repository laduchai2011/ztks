CREATE PROCEDURE CreateMessage
	@eventName NVARCHAR(255),
	@sender NVARCHAR(255),
	@senderId NVARCHAR(255),
	@receiveId NVARCHAR(255),
	@message NVARCHAR(MAX),
	@type NVARCHAR(255),
	@timestamp NVARCHAR(255),
	@messageStatus NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @newMessageId INT;

		-- Thêm medication
        INSERT INTO dbo.message (eventName, sender, receiveId, message, type, timestamp, messageStatus, status, accountId, updateTime, createTime)
        VALUES (@eventName, @sender, @receiveId, @message, @type, @timestamp, @messageStatus, 'normal', @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SET @newMessageId = SCOPE_IDENTITY();

		 -- 👇 KIỂM TRA CHUỖI SENDER Ở ĐÂY
        -----------------------------------------------------
        IF (@sender LIKE 'CUSTOMER')
        BEGIN
			INSERT INTO dbo.isNewMessage (myCustomerId, updateTime, createTime)
            SELECT id, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET()
            FROM dbo.myCustomer
            WHERE senderId = @senderId
              AND accountId = @accountId;
        END
        -----------------------------------------------------

		SELECT * FROM dbo.message WHERE id = @newMessageId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE UpdateEvent_MemberSend
	@eventName NVARCHAR(255),
	@receiveId NVARCHAR(255),
	@timestamp NVARCHAR(255),
	@messageStatus NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @messageId INT;

		SELECT @messageId = id
        FROM dbo.message
        WHERE 
			receiveId = @receiveId 
			AND accountId = @accountId
			AND messageStatus = 'SENDING'

		UPDATE dbo.message
		SET eventName = @eventName,
			timestamp = @timestamp,
			messageStatus = @messageStatus
		WHERE id = @messageId;

		SELECT * FROM dbo.message WHERE id = @messageId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE UpdateMessageStatus
	@eventName NVARCHAR(255),
	@receiveId NVARCHAR(255),
	@timestamp NVARCHAR(255),
	@messageStatus NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @messageId INT;

		SELECT @messageId = id
        FROM dbo.message
        WHERE 
			receiveId = @receiveId 
			AND accountId = @accountId;

		UPDATE dbo.message
		SET eventName = @eventName,
			timestamp = @timestamp,
			messageStatus = @messageStatus
		WHERE 
			receiveId = @receiveId 
			AND accountId = @accountId;

		SELECT * FROM dbo.message WHERE id = @messageId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE SendVideoTdFailure
	@id NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @messageId INT;

		SELECT @messageId = id
        FROM dbo.message
        WHERE 
			id = @id
			AND status = 'normal' ;

		UPDATE dbo.message
		SET status = 'failure'
		WHERE 
			id = @id
			AND status = 'normal' ;

		SELECT * FROM dbo.message WHERE id = @messageId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE SendVideoTdSuccess
	@id NVARCHAR(255), 
	@message NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @messageId INT;

		SELECT @messageId = id
        FROM dbo.message
        WHERE 
			id = @id
			AND status = 'normal' ;

		UPDATE dbo.message
		SET 
			messageStatus = 'SENT',
			message = @message
		WHERE 
			id = @id
			AND status = 'normal' ;

		SELECT * FROM dbo.message WHERE id = @messageId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

delete dbo.message
go


