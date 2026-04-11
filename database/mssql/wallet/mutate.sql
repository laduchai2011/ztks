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
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo ví không thành công.', 1;
        END

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

ALTER PROCEDURE PayOrder
	@walletId INT,
	@addedAmount DECIMAL(20,2),
	@orderId INT,
	@payHookId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		-- Kiểm tra voucher đã dùng hay chưa, đã chết hạn chưa
		DECLARE @voucherId INT;
		DECLARE @isUsed BIT;
		DECLARE @timeExpire DATETIMEOFFSET(7);
		DECLARE @money_voucher DECIMAL(20,2);
		SELECT @voucherId = id, @isUsed = isUsed, @timeExpire = timeExpire, @money_voucher = money FROM dbo.voucher WHERE orderId = @orderId;
		IF @isUsed = 1
		BEGIN
			THROW 50001, N'Voucher đã được sử dụng .', 1;
		END
		IF @timeExpire < SYSDATETIMEOFFSET()
		BEGIN
			THROW 50002, N'Voucher đã hết hạn .', 2;
		END

		DECLARE @money_order DECIMAL(20,2);
		SELECT @money_order = money FROM dbo.[order] WHERE id = @orderId;
		IF @money_order IS NULL THROW 50002, N'Không tìm thấy tiền trong đơn hàng .', 2;
		IF @money_order > @addedAmount + COALESCE(@money_voucher, 0)
		BEGIN
			THROW 50003, N'Tiền chuyển vào không đủ .', 3;
		END

		-- cập nhật tiền nhận được từ chuyển khoản
        UPDATE dbo.wallet
		SET amount = amount + @addedAmount, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @walletId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Cập nhật ví không thành công.', 4;
        END
		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, voucherId, orderId, walletId, createTime)
        VALUES (@addedAmount, 'payOrder', @payHookId, NULL, @orderId, @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50005, 'Cập nhật biến động số dư không thành công.', 5;
        END

		-- cập nhật tiền nhận được từ voucher
		IF ( @voucherId IS NOT NULL )
		BEGIN
			UPDATE dbo.voucher
			SET isUsed = 1
			WHERE id = @voucherId
			IF @@ROWCOUNT = 0
			BEGIN
				THROW 5006, 'Cập nhật trạng thái sử dụng voucher không thành công.', 6;
			END

			UPDATE dbo.wallet
			SET amount = amount + @money_voucher, updateTime = SYSDATETIMEOFFSET()
			WHERE id = @walletId
			IF @@ROWCOUNT = 0
			BEGIN
				THROW 50007, 'Hoàn tiền từ voucher tới ví không thành công.', 7;
			END
			INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, voucherId, orderId, walletId, createTime)
			VALUES (@money_voucher, 'voucher', NULL, @voucherId, NULL, @walletId, SYSDATETIMEOFFSET());
			IF @@ROWCOUNT = 0
			BEGIN
				THROW 50008, 'Cập nhật biến động số dư hoàn tiền từ voucher không thành công.', 8;
			END
		END

		-- trừ tiền phí dịch vụ 1%
		UPDATE dbo.wallet
		SET amount = amount - (@addedAmount + COALESCE(@money_voucher, 0)) * 0.01, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @walletId
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50009, 'Cập nhật ví khấu trừ phí không thành công.', 9;
		END
		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, voucherId, orderId, walletId, createTime)
		VALUES (- (@addedAmount + COALESCE(@money_voucher, 0)) * 0.01, 'cost1%', NULL, NULL, NULL, @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50010, 'Cập nhật biến động số dư khấu trừ phí không thành công.', 10;
		END

		UPDATE dbo.[order]
		SET isPay = 1
		WHERE status = 'normal' AND id = @orderId
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50011, N'Cập nhật đơn hàng không thành công .', 11;
		END
		
		SELECT * FROM dbo.[order] WHERE id = @orderId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

-- bo
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
            THROW 50001, 'Cập nhật ví không thành công.', 1;
        END

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (@addedAmount, 'payOrder', @payHookId, @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
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
            THROW 50001, 'Tiền không đủ.', 1;
        END

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (-50000, 'payAgent', NULL, @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
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