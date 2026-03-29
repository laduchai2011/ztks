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

CREATE PROCEDURE UpdateOrder
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

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.[order]
			WHERE 
				status = 'normal'
				AND id = @id
				AND accountId = @accountId
		)
		BEGIN
			THROW 50002, N'Đơn hàng không hợp lệ .', 1;
		END

        UPDATE dbo.[order]
		SET 
			label = @label, 
			content = @content,
			money = @money,
			phone = @phone
		WHERE 
			status = 'normal'
			AND id = @id
			AND isPay = 0

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

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.[order]
			WHERE 
				status = 'normal'
				AND id = @orderId
				AND accountId = @accountId
		)
		BEGIN
			THROW 50002, N'Đơn hàng không hợp lệ .', 1;
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