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

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (@addedAmount, 'payOrder', @payHookId, @walletId, SYSDATETIMEOFFSET());

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
