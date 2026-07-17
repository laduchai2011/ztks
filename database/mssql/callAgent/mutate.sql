CREATE PROCEDURE CreateCallAgent
	@agentCode NVARCHAR(255),
	@password NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @newCallAgentId INT;

		INSERT dbo.callAgent (agentCode, password, accountId)
		VALUES (@agentCode, @password, @accountId)
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo callAgent không thành công.', 1;
        END

		SELECT * FROM dbo.callAgent WHERE id = @newCallAgentId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

-- CREATE PROCEDURE UpdateUidForCallAgent
-- 	@id INT,
-- 	@uid NVARCHAR(255),
-- 	@accountId INT
-- AS
-- BEGIN
-- 	SET NOCOUNT ON;
-- 	BEGIN TRY
--         BEGIN TRANSACTION;

-- 		UPDATE dbo.callAgent
-- 		SET uid = @uid
-- 		WHERE id = @id and accountId = @accountId;
-- 		IF @@ROWCOUNT = 0
--         BEGIN
--             THROW 50001, 'Cập nhật uid cho CallAgent không thành công.', 1;
--         END

-- 		SELECT * FROM dbo.callAgent WHERE id = @id;

-- 		COMMIT TRANSACTION;
-- 	END TRY
-- 	BEGIN CATCH
-- 		IF @@TRANCOUNT > 0
-- 			ROLLBACK TRANSACTION;
-- 		THROW;
-- 	END CATCH
-- END;
-- GO

CREATE PROCEDURE CreateZaloTrunk
	@trunkCode NVARCHAR(255),
	@domain NVARCHAR(255),
	@appId NVARCHAR(255),
	@oaId NVARCHAR(255),
	@port NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @newCallAgentId INT;

		INSERT zaloTrunk (trunkCode, domain, fromUser, contact, accountId)
		VALUES ( 'zcc01', appId + '.zcc.openapi.zaloapp.com', oaId, 'sip:' + appId + '.zcc.openapi.zaloapp.com:' + port, 1)
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo callAgent không thành công.', 1;
        END

		SELECT * FROM dbo.callAgent WHERE id = @newCallAgentId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO