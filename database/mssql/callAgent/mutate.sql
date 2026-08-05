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
	@appId NVARCHAR(255),
	@oaId NVARCHAR(255),
	@callAgentId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.callAgent WHERE id = @callAgentId AND  accountId = @accountId )
		BEGIN
			THROW 50001, N'callAgent này không phải của bạn .', 1;
		END

		DECLARE @zaloTrunkId INT;

		SELECT @zaloTrunkId = id FROM dbo.zaloTrunk WHERE domain = @appId + '.zcc.openapi.zaloapp.com' AND fromUser = @oaId;

		DECLARE @newCallPermitId INT;

		INSERT dbo.callPermit (uid, callAgentId, zaloTrunkId)
		VALUES (@uid, @callAgentId, @zaloTrunkId)
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, N'Tạo callPermit không thành công.', 2;
        END

		SET @newCallPermitId = SCOPE_IDENTITY();

		SELECT * FROM dbo.callPermit WHERE id = @newCallPermitId;

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
	@appId NVARCHAR(255),
	@oaId NVARCHAR(255),
	@port NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.zaloApp WHERE appId = @appId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Không phải zaloApp của bạn .', 1;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.zaloOa WHERE oaId = @oaId AND accountId = @accountId )
		BEGIN
			THROW 50002, N'Không phải zaloOa của bạn .', 2;
		END

		DECLARE @newZaloTrunkId INT;

		INSERT dbo.zaloTrunk (trunkCode, domain, fromUser, contact, accountId)
		VALUES (@trunkCode, @appId + '.zcc.openapi.zaloapp.com', @oaId, 'sip:' + @appId + '.zcc.openapi.zaloapp.com:' + @port, @accountId)
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, N'Tạo zalo-trunk không thành công.', 3;
        END

		SET @newZaloTrunkId = SCOPE_IDENTITY();

		SELECT * FROM dbo.zaloTrunk WHERE id = @newZaloTrunkId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO