CREATE PROCEDURE CreateOrder
	@uuid NVARCHAR(255),
	@label NVARCHAR(255),
	@content NVARCHAR(MAX),
	@money DECIMAL(20,2),
	@phone NVARCHAR(255),
	@chatRoomId INT,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		
		IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE id = @chatRoomId AND zaloOaId = @zaloOaId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'ChatRoom không tồn tại hoặc đã bị khóa.', 1;
		END

		DECLARE @newOrderId INT;

        INSERT INTO dbo.[order] (uuid, label, content, money, isPay, phone, status, chatRoomId, zaloOaId, accountId, updateTime, createTime)
        VALUES (@uuid, @label, @content, @money, 0, @phone, 'normal', @chatRoomId, @zaloOaId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50002, N'Thêm dữ liệu không thành công .', 2;
		END

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

CREATE PROCEDURE UpdateOrder
	@id INT,
	@label NVARCHAR(255),
	@content NVARCHAR(MAX),
	@money DECIMAL(20,2),
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
				IF @@ROWCOUNT = 0
				BEGIN
					THROW 50002, 'Bỏ voucher cũ không thành công.', 2;
				END
			END
		END

        UPDATE dbo.[order]
		SET label = @label, content = @content, money = @money, phone = @phone
		WHERE status = 'normal' AND id = @id AND isPay = 0
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Cập nhật đơn hàng không thành công.', 3;
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

		IF NOT EXISTS ( SELECT 1 FROM dbo.[order] WHERE status = 'normal' AND id = @orderId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Đơn hàng không hợp lệ .', 1;
		END
		
		DECLARE @newOrderStatusId INT;

        INSERT INTO dbo.orderStatus (type, content, orderId, updateTime, createTime)
        VALUES (@type, @content, @orderId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50002, N'Thêm trạng thái không thành công .', 2;
		END

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