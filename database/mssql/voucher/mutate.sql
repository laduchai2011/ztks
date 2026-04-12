CREATE PROCEDURE CreateVoucher
	@dayAmount INT, 
	@money DECIMAL(20,2), 
	@phone NVARCHAR(255),
    @memberZtksId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.accountInformation WHERE accountId = @memberZtksId AND accountType = 'memberZtks' )
		BEGIN
			THROW 50001, N'Không phải tài khoản memberZtks .', 1;
		END

		DECLARE @newVoucherId INT;

        INSERT INTO dbo.voucher (isUsed, timeExpire, money, orderId, memberZtksId, phone, updateTime, createTime)
        VALUES (0, DATEADD(DAY, @dayAmount, SYSDATETIMEOFFSET()), @money, NULL, @memberZtksId, @phone, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo voucher không thành công.', 2;
        END

		SET @newVoucherId = SCOPE_IDENTITY();

		SELECT * FROM dbo.voucher WHERE id = @newVoucherId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE CustomerUseVoucher
	@orderId INT,
	@voucherId INT,
	@customerId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		-- Kiểm tra đơn hàng đã thanh toán hay chưa
		DECLARE @isPay INT;
		SELECT @isPay = isPay FROM dbo.[order] WHERE id = @orderId;
		IF @isPay = 1
		BEGIN
			THROW 50001, N'Đơn hàng đã thanh toán không thể thay đổi .', 1;
		END

		-- Kiểm tra voucher đã dùng hay chưa, đã chết hạn chưa
		DECLARE @isUsed BIT;
		DECLARE @timeExpire DATETIMEOFFSET(7);
		DECLARE @money_new_voucher DECIMAL(20,2);
		SELECT @isUsed = isUsed, @timeExpire = timeExpire, @money_new_voucher = money FROM dbo.voucher WHERE id = @voucherId;
		IF @isUsed = 1
		BEGIN
			THROW 50002, N'Voucher đã được sử dụng .', 2;
		END
		IF @timeExpire < SYSDATETIMEOFFSET()
		BEGIN
			THROW 50003, N'Voucher đã hết hạn .', 3;
		END

		DECLARE @customerPhone NVARCHAR(255);
		SELECT @customerPhone = phone FROM dbo.customer WHERE id = @customerId;
		IF @customerPhone IS NULL THROW 50002, N'Tài khoản không tồn tại', 2;

		IF NOT EXISTS ( SELECT 1 FROM dbo.voucher WHERE id = @voucherId AND phone = @customerPhone )
		BEGIN
			THROW 50004, N'Voucher này không phải của bạn .', 4;
		END

		DECLARE @phone_order NVARCHAR(255);
		SELECT @phone_order = phone FROM dbo.[order] WHERE id = @orderId;
		IF @phone_order IS NULL THROW 50005, N'Không tìm thấy số điện thoại của đơn hàng', 5;

		DECLARE @phone_voucher NVARCHAR(255);
		SELECT @phone_voucher = phone FROM dbo.voucher WHERE id = @voucherId;
		IF @phone_voucher IS NULL THROW 50006, N'Không tìm thấy số điện thoại của voucher', 6;

		-- So sánh 2 số điện thoại
		IF @phone_order <> @phone_voucher
		BEGIN
			THROW 50007, N'Số điện thoại của voucher không khớp với đơn hàng', 7;
		END

		DECLARE @selected_voucherId INT;
		DECLARE @money_selected_voucher DECIMAL(20,2);
		SELECT @selected_voucherId = id, @money_selected_voucher = money FROM dbo.voucher WHERE orderId = @orderId;
		IF @selected_voucherId IS NOT NULL
		BEGIN
			UPDATE dbo.voucher
			SET orderId = NULL
			WHERE id = @selected_voucherId
			IF @@ROWCOUNT = 0
			BEGIN
				THROW 50008, 'Bỏ chọn voucher cũ không thành công .', 8;
			END
		END

        UPDATE dbo.voucher
		SET orderId = @orderId
		WHERE id = @voucherId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50009, 'Cập nhật voucher cho đơn hàng không thành công .', 9;
        END

		SELECT * FROM dbo.voucher WHERE id = @voucherId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO