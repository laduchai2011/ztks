CREATE PROCEDURE CreateAgent
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE accountId = @accountId AND accountType = 'admin'
		)
		BEGIN
			THROW 50001, N'Không phải tài khoản admin .', 1;
		END

		DECLARE @newAgentId INT;

        INSERT INTO dbo.agent (type, expiry, status, agentAccountId, accountId, updateTime, createTime)
        VALUES ('basic', NULL, 'normal', NULL, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật agent không thành công.', 2;
        END

		SET @newAgentId = SCOPE_IDENTITY();

		SELECT * FROM dbo.agent WHERE id = @newAgentId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE AgentAddAccount
	@id INT,
	@agentAccountId INT = NULL,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE accountId = @accountId AND accountType = 'admin'
		)
		BEGIN
			THROW 50001, N'Không phải tài khoản admin .', 1;
		END

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE addedById = @accountId AND accountId = @agentAccountId
		)
		BEGIN
			THROW 50002, N'Thành viên này chưa có trong danh sách !', 2;
		END

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.agent
			WHERE id = @id AND accountId = @accountId
		)
		BEGIN
			THROW 50003, N'Agent này không phải của bạn !', 3;
		END

		UPDATE dbo.agent
		SET agentAccountId = @agentAccountId
		WHERE id = @id;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Cập nhật agent không thành công.', 4;
        END

		SELECT * FROM dbo.agent WHERE status = 'normal' AND id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE AgentDelAccount
	@id INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.agent
			WHERE id = @id AND accountId = @accountId
		)
		BEGIN
			THROW 50001, N'Agent này không phải của bạn !', 1;
		END

		UPDATE dbo.agent
		SET agentAccountId = NULL
		WHERE id = @id;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật agent không thành công.', 2;
        END

		SELECT * FROM dbo.agent WHERE status = 'normal' AND id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE CreateAgentPay
	@agentId INT, 
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.accountInformation WHERE accountId = @accountId AND accountType = 'admin' )
		BEGIN
			THROW 50001, N'Không phải tài khoản admin .', 1;
		END

		IF EXISTS ( SELECT 1 FROM dbo.agentPay WHERE accountId = @accountId AND agentId = @agentId AND isPay = 0 )
		BEGIN
			THROW 50002, N'Đã tồn tại 1 agentPay .', 2;
		END
		
		DECLARE @newAgentPayId INT;

        INSERT INTO dbo.agentPay (isPay, agentId, accountId, updateTime, createTime)
        VALUES (0, @agentId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Cập nhật agentPay không thành công.', 3;
        END

		SET @newAgentPayId = SCOPE_IDENTITY();

		SELECT * FROM dbo.agentPay WHERE id = @newAgentPayId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

CREATE PROCEDURE UpdateAgentPaid
	@id INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.agentPay WHERE isPay = 0 AND id = @id )
		BEGIN
			THROW 50001, N'Chưa tồn tại 1 agentPay .', 1;
		END
		
		UPDATE dbo.agentPay
		SET isPay = 1
		WHERE id = @id;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật agentPay không thành công.', 2;
        END

		DECLARE @agentId INT;
		SELECT @agentId = agentId FROM dbo.agentPay WHERE id = @id;
		IF @agentId IS NULL THROW 50003, N'Agent không tồn tại', 3;
		UPDATE dbo.agent
		SET expiry = DATEADD(MONTH, 1, SYSDATETIMEOFFSET()), type = 'upgrade'
		WHERE id = @agentId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Cập nhật agent không thành công.', 4;
        END

		SELECT * FROM dbo.agentPay WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

delete dbo.agentPay