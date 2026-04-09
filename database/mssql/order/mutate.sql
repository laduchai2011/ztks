CREATE PROCEDURE CreateOrder
	@uuid NVARCHAR(255),
	@label NVARCHAR(255),
	@content NVARCHAR(MAX),
	@money BIGINT,
	@phone NVARCHAR(255),
	@chatRoomId INT,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		
		IF NOT EXISTS (
			SELECT 1
			FROM dbo.chatRoom
			WHERE 
				id = @chatRoomId
				AND zaloOaId = @zaloOaId
				AND accountId = @accountId
		)
		BEGIN
			THROW 50002, N'ChatRoom không tồn tại hoặc đã bị khóa.', 1;
		END

		DECLARE @newOrderId INT;

        INSERT INTO dbo.[order] (uuid, label, content, money, isPay, phone, status, chatRoomId, zaloOaId, accountId, updateTime, createTime)
        VALUES (@uuid, @label, @content, @money, 0, @phone, 'normal', @chatRoomId, @zaloOaId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SET @newOrderId = SCOPE_IDENTITY();

		SELECT * FROM dbo.[order] WHERE id = @newOrderId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE UpdateOrder
	@id INT,
	@label NVARCHAR(255),
	@content NVARCHAR(MAX),
	@money BIGINT,
	@phone NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.[order] WHERE status = 'normal' AND id = @id AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Đơn hàng không hợp lệ .', 1;
		END

		DECLARE @phone_voucher INT;
		SELECT @phone_voucher = phone FROM dbo.voucher WHERE orderId = @id;
		--IF @phone_voucher IS NULL THROW 50002, N'Không tìm số điện thoại của voucher', 2;

		IF @phone_voucher IS NOT NULL
		BEGIN
			IF NOT (@phone IS NOT NULL AND @phone_voucher = @phone)
			BEGIN
				UPDATE dbo.voucher
				SET orderId = NULL
				WHERE orderId = @id
			END
		END

        UPDATE dbo.[order]
		SET label = @label, content = @content, money = @money, phone = @phone
		WHERE status = 'normal' AND id = @id AND isPay = 0
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật đơn hàng không thành công.', 2;
        END

		SELECT * FROM dbo.[order] WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

-- bo
ALTER PROCEDURE OrderSelectVoucher
	@id INT,
	@voucherId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.[order] WHERE status = 'normal' AND id = @id AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Đơn hàng không hợp lệ .', 1;
		END

		DECLARE @phone_order INT;
		SELECT @phone_order = phone FROM dbo.[order] WHERE id = @id;
		IF @phone_order IS NULL THROW 50002, N'Không tìm thấy số điện thoại của đơn hàng', 2;

		DECLARE @phone_voucher INT;
		SELECT @phone_voucher = phone FROM dbo.voucher WHERE id = @voucherId;
		IF @phone_voucher IS NULL THROW 50003, N'Không tìm thấy số điện thoại của voucher', 3;

		-- So sánh 2 số điện thoại
		IF @phone_order <> @phone_voucher
		BEGIN
			THROW 50004, N'Số điện thoại của voucher không khớp với đơn hàng', 4;
		END

        UPDATE dbo.voucher
		SET orderId = @id
		WHERE id = @voucherId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50005, 'Cập nhật voucher cho đơn hàng .', 5;
        END

		SELECT * FROM dbo.[order] WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

CREATE PROCEDURE CustomerUseVoucher
	@orderId INT,
	@voucherId INT,
	@customerPhone NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.voucher WHERE id = @voucherId AND phone = @customerPhone )
		BEGIN
			THROW 50001, N'Voucher này không phải của bạn .', 1;
		END

		DECLARE @phone_order INT;
		SELECT @phone_order = phone FROM dbo.[order] WHERE id = @orderId;
		IF @phone_order IS NULL THROW 50002, N'Không tìm thấy số điện thoại của đơn hàng', 2;

		DECLARE @phone_voucher INT;
		SELECT @phone_voucher = phone FROM dbo.voucher WHERE id = @voucherId;
		IF @phone_voucher IS NULL THROW 50003, N'Không tìm thấy số điện thoại của voucher', 3;

		-- So sánh 2 số điện thoại
		IF @phone_order <> @phone_voucher
		BEGIN
			THROW 50004, N'Số điện thoại của voucher không khớp với đơn hàng', 4;
		END

        UPDATE dbo.voucher
		SET orderId = @orderId
		WHERE id = @voucherId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50005, 'Cập nhật voucher cho đơn hàng không thành công .', 5;
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

CREATE PROCEDURE CreateOrderStatus
	@type NVARCHAR(255),
	@content NVARCHAR(255),
    @orderId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.[order]
			WHERE 
				status = 'normal'
				AND id = @orderId
				AND accountId = @accountId
		)
		BEGIN
			THROW 50001, N'Đơn hàng không hợp lệ .', 1;
		END
		

		DECLARE @newOrderStatusId INT;

        INSERT INTO dbo.orderStatus (type, content, orderId, updateTime, createTime)
        VALUES (@type, @content, @orderId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SET @newOrderStatusId = SCOPE_IDENTITY();

		SELECT * FROM dbo.orderStatus WHERE id = @newOrderStatusId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE UpdateOrderPaid
	@id INT,
	@money BIGINT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE dbo.[order]
		SET isPay = 1
		WHERE status = 'normal' AND id = @id AND @money >= money;

		SELECT * FROM dbo.[order] WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO