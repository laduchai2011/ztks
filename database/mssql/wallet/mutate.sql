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

CREATE PROCEDURE PayOrder
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

CREATE PROCEDURE PayAgentFromWallet
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
		IF NOT EXISTS ( SELECT 1 FROM dbo.agentPay WHERE isPay = 0 AND id = @agentPayId )
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

ALTER PROCEDURE CreateRequireTakeMoney
	@amount DECIMAL(20,2),
	@bankId INT,
	@walletId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;
		IF NOT EXISTS ( SELECT 1 FROM dbo.bank WHERE id = @bankId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Ngân hàng này không phải của bạn .', 1;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.wallet WHERE id = @walletId AND accountId = @accountId )
		BEGIN
			THROW 50002, N'Ví này không phải của bạn .', 2;
		END

		IF EXISTS ( SELECT 1 FROM dbo.wallet WHERE id = @walletId AND type = '1' )
		BEGIN
			THROW 50003, N'Không thể rút tiền từ ví 1 .', 3;
		END

		IF EXISTS ( SELECT 1 FROM dbo.requireTakeMoney WHERE walletId = @walletId AND accountId = @accountId AND isDo = 0 AND isDelete = 0 )
		BEGIN
			THROW 50004, N'Đã tồn tại 1 yêu cầu rút tiền, không thể tạo thêm yêu cầu mới .', 4;
		END

		DECLARE @moneyAmount DECIMAL(20,2);
		SELECT @moneyAmount = amount FROM dbo.wallet WHERE id = @walletId;
		IF @moneyAmount IS NULL THROW 50003, N'Ví không tồn tại .', 3;
		IF @amount > @moneyAmount
		BEGIN
			THROW 50005, N'Tiền không đủ .', 5;
		END

		DECLARE @costTakeMoney5 INT;
		SET @costTakeMoney5 = 5000;
		IF @amount < @costTakeMoney5
		BEGIN
			THROW 50006, N'Tiền yêu cầu quá nhỏ .', 6;
		END

		DECLARE @newRequireTakeMoneyId INT;
		INSERT INTO dbo.requireTakeMoney (amount, bankId, walletId, accountId, updateTime, createTime)
		VALUES (@amount, @bankId, @walletId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50007, N'Yêu cầu rút tiền không thành công .', 7;
		END
		SET @newRequireTakeMoneyId = SCOPE_IDENTITY();

		SELECT * FROM dbo.requireTakeMoney WHERE id = @newRequireTakeMoneyId
	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

ALTER PROCEDURE EditRequireTakeMoney
	@requireTakeMoneyId INT,
	@amount DECIMAL(20,2),
	@bankId INT,
	@walletId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;
		IF NOT EXISTS ( SELECT 1 FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId AND accountId = @accountId AND isDelete = 0 )
		BEGIN
			THROW 50001, N'Yêu cầu rút tiền này không phải của bạn .', 1;
		END

		DECLARE @memberZtksId INT;
		SELECT @memberZtksId = memberZtksId FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId;
		IF @memberZtksId IS NOT NULL THROW 50002, N'Yêu cầu rút tiền này đã được xác nhận nên không thể chỉnh sửa .', 2;

		IF NOT EXISTS ( SELECT 1 FROM dbo.bank WHERE id = @bankId AND accountId = @accountId )
		BEGIN
			THROW 50003, N'Ngân hàng này không phải của bạn .', 3;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.wallet WHERE id = @walletId AND accountId = @accountId )
		BEGIN
			THROW 50004, N'Ví này không phải của bạn .', 4;
		END

		IF EXISTS ( SELECT 1 FROM dbo.wallet WHERE id = @walletId AND type = '1' )
		BEGIN
			THROW 50005, N'Không thể rút tiền từ ví 1 .', 5;
		END

		DECLARE @moneyAmount DECIMAL(20,2);
		SELECT @moneyAmount = amount FROM dbo.wallet WHERE id = @walletId;
		IF @moneyAmount IS NULL THROW 50003, N'Ví không tồn tại .', 3;
		IF @amount > @moneyAmount
		BEGIN
			THROW 50006, N'Tiền không đủ .', 6;
		END

		DECLARE @costTakeMoney5 INT;
		SET @costTakeMoney5 = 5000;
		IF @amount < @costTakeMoney5
		BEGIN
			THROW 50007, N'Tiền yêu cầu quá nhỏ .', 7;
		END

		UPDATE dbo.requireTakeMoney
		SET amount = @amount, bankId = @bankId
		WHERE id = @requireTakeMoneyId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50008, 'Cập nhật yêu cầu rút tiền thất bại.', 8;
        END

		SELECT * FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId
	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

ALTER PROCEDURE DeleteRequireTakeMoney
	@requireTakeMoneyId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;
	IF NOT EXISTS ( SELECT 1 FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId AND accountId = @accountId AND isDelete = 0 )
	BEGIN
		THROW 50001, N'Yêu cầu rút tiền này không phải của bạn .', 1;
	END

	DECLARE @memberZtksId INT;
	SELECT @memberZtksId = memberZtksId FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId;
	IF @memberZtksId IS NOT NULL THROW 50002, N'Không thể xóa yêu cầu tút tiền khi đã được xác nhận .', 2;

	UPDATE dbo.requireTakeMoney
	SET isDelete = 1
	WHERE id = @requireTakeMoneyId
	IF @@ROWCOUNT = 0
    BEGIN
       THROW 50003, 'Huỷ yêu cầu rút tiền không thành công .', 3;
    END

	SELECT * FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId
	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

CREATE PROCEDURE MemberZtksConfirmTakeMoney
	@requireTakeMoneyId INT,
	@memberZtksId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;
		IF NOT EXISTS ( SELECT 1 FROM dbo.accountInformation WHERE accountId = @memberZtksId AND accountType = 'memberZtks' )
		BEGIN
			THROW 50001, N'Không tồn tại memberZtks này .', 1;
		END

		UPDATE dbo.requireTakeMoney
		SET memberZtksId = @memberZtksId
		WHERE id = @requireTakeMoneyId AND isDelete = 0;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'MemberZtks các nhận yêu cầu KHÔNG thành công .', 2;
        END

		SELECT * FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId
	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

ALTER PROCEDURE PayOut
	@amount DECIMAL(20,2),
	@bankId INT,
	@payHookId INT,
	@requireTakeMoneyId INT,
	@walletId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;
		IF NOT EXISTS ( SELECT 1 FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Yêu cầu rút tiền này không phải của bạn .', 1;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.bank WHERE id = @bankId AND accountId = @accountId )
		BEGIN
			THROW 50002, N'Ngân hàng này không phải của bạn .', 2;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.wallet WHERE id = @walletId AND accountId = @accountId )
		BEGIN
			THROW 50003, N'Ví này không phải của bạn .', 3;
		END

		IF EXISTS ( SELECT 1 FROM dbo.requireTakeMoney WHERE id = @requireTakeMoneyId AND accountId = @accountId AND isDelete = 1 )
		BEGIN
			THROW 50004, N'Yêu cầu rút tiền này đã bị xóa .', 4;
		END

		DECLARE @costTakeMoney5 INT;
		SET @costTakeMoney5 = 5000;

		-- cập nhật tiền chuyển ra khỏi ví
        UPDATE dbo.wallet
		SET amount = amount - @amount + @costTakeMoney5, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @walletId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50005, 'Cập nhật tiền ra khỏi ví không thành công.', 5;
        END
		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, requireTakeMoneyId, walletId, createTime)
        VALUES (- @amount, 'takeMoney', @payHookId, @requireTakeMoneyId, @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50006, 'Cập nhật biến động số dư tiền ra khỏi ví không thành công.', 6;
        END

		-- khấu trừ phí rút tiền 5000
        UPDATE dbo.wallet
		SET amount = amount - @costTakeMoney5, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @walletId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50007, 'Cập nhật khấu trừ phí rút tiền không thành công.', 7;
        END
		INSERT INTO dbo.balanceFluctuation (amount, type, walletId, createTime)
        VALUES (- @amount, 'takeMoney', @walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50008, 'Cập nhật biến động số dư khấu trừ phí rút tiền không thành công.', 8;
        END

		-- cập nhật yêu cầu rút tiền hoàn 
		UPDATE dbo.requireTakeMoney
		SET isDo = 1, doTime = SYSDATETIMEOFFSET()
		WHERE id = @requireTakeMoneyId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50009, 'Cập nhật yêu cầu rút tiền thất bại.', 9;
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


DELETE FROM dbo.requireTakeMoney;