-- CREATE PROCEDURE CreateCallAgent
-- 	@agentCode NVARCHAR(255),
-- 	@password NVARCHAR(255),
-- 	@accountId INT
-- AS
-- BEGIN
-- 	SET NOCOUNT ON;
-- 	BEGIN TRY
--         BEGIN TRANSACTION;

-- 		IF EXISTS ( SELECT 1 FROM dbo.callAgent WHERE accountId = @accountId )
-- 		BEGIN
-- 			THROW 50001, N'Đã tồn tại callAgent cho tài khoản này .', 1;
-- 		END

-- 		DECLARE @newCallAgentId INT;

-- 		INSERT dbo.callAgent (agentCode, password, accountId)
-- 		VALUES (@agentCode, @password, @accountId)
-- 		IF @@ROWCOUNT = 0
--         BEGIN
--             THROW 50002, N'Tạo callAgent không thành công.', 2;
--         END

-- 		SELECT * FROM dbo.callAgent WHERE id = @newCallAgentId;

-- 		COMMIT TRANSACTION;
-- 	END TRY
-- 	BEGIN CATCH
-- 		IF @@TRANCOUNT > 0
-- 			ROLLBACK TRANSACTION;
-- 		THROW;
-- 	END CATCH
-- END;
-- GO

CREATE PROCEDURE CreateCallPermit
	@uid NVARCHAR(255),
	@callAgentId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.callAgent WHERE accountId = @accountId )
		BEGIN
			THROW 50001, N'callAgent này không phải của bạn .', 1;
		END

		DECLARE @newCallPermitId INT;

		INSERT dbo.callAgent (agentCode, password, accountId)
		VALUES (@agentCode, @password, @accountId)
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, N'Tạo callAgent không thành công.', 2;
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
		VALUES ( @trunkCode, appId + '.zcc.openapi.zaloapp.com', oaId, 'sip:' + appId + '.zcc.openapi.zaloapp.com:' + port, 1)
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, N'Tạo callAgent không thành công.', 1;
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