ALTER PROCEDURE CreateOrder
	@uuid NVARCHAR(255),
	@label NVARCHAR(255),
	@content NVARCHAR(MAX),
	@money DECIMAL(20,2),
	@phone NVARCHAR(255),
	@chatRoomId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		
		IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE id = @chatRoomId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'ChatRoom không tồn tại .', 1;
		END

		IF EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE id = @chatRoomId AND status = 'delete' )
		BEGIN
			THROW 50002, N'ChatRoom đã bị xóa .', 2;
		END

		DECLARE @newOrderId INT;

        INSERT INTO dbo.[order] (uuid, label, content, money, isPay, phone, isDelete, chatRoomId, updateTime, createTime)
        VALUES (@uuid, @label, @content, @money, 0, @phone, 0, @chatRoomId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50003, N'Thêm dữ liệu không thành công .', 3;
		END

		SET @newOrderId = SCOPE_IDENTITY();

		DECLARE @adminAccountId INT;
		DECLARE @zaloOaId INT;
		DECLARE @createTimeOfOrder DATETIMEOFFSET(7);

		SELECT @adminAccountId = addedById FROM dbo.accountInformation WHERE accountId = @accountId
		IF @chatRoomId IS NULL THROW 50004, N'Không tìm thấy adminAccountId .', 4;

		SELECT @zaloOaId = id FROM dbo.zaloOa WHERE accountId = @adminAccountId
		IF @zaloOaId IS NULL THROW 50005, N'Không tìm thấy zaloOaId .', 5;

		SELECT @createTimeOfOrder = CONVERT(VARCHAR(10), createTime, 23) FROM dbo.[order] WHERE id = @newOrderId;
		IF @createTimeOfOrder IS NULL THROW 50006, N'Không tìm thấy createTimeOfOrder .', 6;

		SELECT * FROM dbo.[order] WHERE id = @newOrderId;

		SELECT 0 AS sales, @zaloOaId AS zaloOaId, @adminAccountId AS accountId, @createTimeOfOrder as ofDay;

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
	@money DECIMAL(20,2),
	@phone NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @chatRoomId INT;
		SELECT @chatRoomId = chatRoomId FROM dbo.[order] WHERE id = @id;
		IF @chatRoomId IS NULL THROW 50001, N'Không tìm thấy chatRoomid của order .', 1;

		IF EXISTS ( SELECT 1 FROM dbo.[order] WHERE id = @id AND isDelete = 1 )
		BEGIN
			THROW 50002, N'Order này đã bị xóa .', 2;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE status = 'normal' AND id = @chatRoomId AND accountId = @accountId )
		BEGIN
			THROW 50003, N'ChatRoom này không phải của bạn .', 3;
		END

		DECLARE @phone_voucher INT;
		SELECT @phone_voucher = phone FROM dbo.voucher WHERE orderId = @id;

		IF @phone_voucher IS NOT NULL
		BEGIN
			IF NOT (@phone IS NOT NULL AND @phone_voucher = @phone)
			BEGIN
				UPDATE dbo.voucher
				SET orderId = NULL
				WHERE orderId = @id
				IF @@ROWCOUNT = 0
				BEGIN
					THROW 50004, 'Bỏ voucher cũ không thành công.', 4;
				END
			END
		END

		DECLARE @oldMoney DECIMAL(20,2);
		SELECT @oldMoney = money FROM dbo.[order] WHERE id = @id
		IF @chatRoomId IS NULL THROW 50005, N'Không tìm thấy order .', 5;

		DECLARE @adminAccountId INT;
		DECLARE @zaloOaId INT;
		DECLARE @createTimeOfOrder DATETIMEOFFSET(7);

		SELECT @adminAccountId = addedById FROM dbo.accountInformation WHERE accountId = @accountId
		IF @chatRoomId IS NULL THROW 50006, N'Không tìm thấy adminAccountId .', 6;

		SELECT @zaloOaId = id FROM dbo.zaloOa WHERE accountId = @adminAccountId
		IF @zaloOaId IS NULL THROW 50007, N'Không tìm thấy zaloOaId .', 7;

		SELECT @createTimeOfOrder = CONVERT(VARCHAR(10), createTime, 23) FROM dbo.[order] WHERE id = @id;
		IF @createTimeOfOrder IS NULL THROW 50008, N'Không tìm thấy createTimeOfOrder .', 8;

        UPDATE dbo.[order]
		SET label = @label, content = @content, money = @money, phone = @phone, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @id AND isPay = 0
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50009, 'Cập nhật đơn hàng không thành công.', 9;
        END

		SELECT * FROM dbo.[order] WHERE id = @id;

		SELECT @money - @oldMoney AS sales, @zaloOaId AS zaloOaId, @adminAccountId AS accountId, @createTimeOfOrder as ofDay;

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

		DECLARE @chatRoomId INT;
		SELECT @chatRoomId = chatRoomId FROM dbo.[order] WHERE id = @orderId;
		IF @chatRoomId IS NULL THROW 50001, N'Không tìm thất chatRoomid của order .', 1;

		IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE status = 'normal' AND id = @chatRoomId AND accountId = @accountId )
		BEGIN
			THROW 50002, N'ChatRoom này không phải của bạn .', 2;
		END
		
		DECLARE @newOrderStatusId INT;

        INSERT INTO dbo.orderStatus (type, content, orderId, createTime)
        VALUES (@type, @content, @orderId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50003, N'Thêm trạng thái không thành công .', 3;
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