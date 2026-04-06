-- bo
ALTER PROCEDURE CreateWallet
	@amount BIGINT, 
	@type NVARCHAR(255),
    @accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @newWalletId INT;

        INSERT INTO dbo.wallet (amount, type, accountId, updateTime, createTime)
        VALUES (@amount, @type, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SET @newWalletId = SCOPE_IDENTITY();

		SELECT * FROM dbo.wallet WHERE id = @newWalletId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE MoneyIn
	@walletId INT,
	@addedAmount BIGINT,
	@payHookId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE dbo.wallet
		SET amount = amount + @addedAmount, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @walletId
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50001, 'Cập nhật ví không thành công.', 1;
        END

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (@addedAmount, 'payOrder', @payHookId, @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50002, 'Cập nhật biến động số dư không thành công.', 2;
        END
		 
		SELECT * FROM dbo.wallet WHERE id = @walletId

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

-- NOT USE
ALTER PROCEDURE MoneyOut
	@walletId INT,
	@subAmount BIGINT,
	@payHookId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE dbo.wallet
		SET amount = amount + @subAmount, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @walletId

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (@subAmount, 'takeMoney', @payHookId, @walletId, SYSDATETIMEOFFSET());

		IF @@ROWCOUNT > 0
		BEGIN
			SELECT * FROM dbo.wallet WHERE id = @walletId
		END

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE PayAgentFromWallet
	@walletId INT,
	@agentPayId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;
		UPDATE dbo.wallet
		SET amount = amount - 50000, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @walletId AND amount >= 50000 AND accountId = @accountId;
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50001, 'Tiền không đủ.', 1;
        END

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (-50000, 'payAgent', NULL, @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50002, 'Tiền không đủ.', 2;
        END

		--UpdateAgentPaid
		IF NOT EXISTS (
			SELECT 1 
			FROM dbo.agentPay
			WHERE isPay = 0 AND id = @agentPayId
		)
		BEGIN
			THROW 50003, N'Chưa tồn tại 1 agentPay .', 3;
		END
		
		UPDATE dbo.agentPay
		SET isPay = 1
		WHERE id = @agentPayId;
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50004, 'Cập nhật Agent-Pay thất bại.', 4;
        END

		DECLARE @agentId INT;
		SELECT @agentId = agentId FROM dbo.agentPay WHERE id = @agentPayId;
		IF @agentId IS NULL THROW 50005, N'Không tìm agentId', 5;

		UPDATE dbo.agent
		SET expiry = DATEADD(MONTH, 1, SYSDATETIMEOFFSET()), type = 'upgrade'
		WHERE id = @agentId;
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50006, 'Cập nhật Agent thất bại.', 6;
        END


		SELECT * FROM dbo.wallet WHERE id = @walletId
	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO