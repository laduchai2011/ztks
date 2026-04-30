ALTER PROCEDURE GetOrders
	@page INT,
    @size INT,
	@uuid NVARCHAR(255) = NULL,
	@moneyFrom DECIMAL(20,2) = NULL,
    @moneyTo DECIMAL(20,2) = NULL,
	@isPay BIT = NULL,
	@phone NVARCHAR(255) = NULL,
	@isDelete BIT = NULL,
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

		-- Tập kết quả 1: dữ liệu phân trang
		;WITH orders AS (
			SELECT o.*,
				ROW_NUMBER() OVER (ORDER BY o.id DESC) AS rn
			FROM dbo.[order] AS o
			WHERE 
				chatRoomId = @chatRoomId
				AND (@uuid IS NULL OR uuid = @uuid)
				AND (@moneyFrom IS NULL OR money >= @moneyFrom)
				AND (@moneyTo   IS NULL OR money <= @moneyTo)
				AND (@isPay IS NULL OR isPay = @isPay)
				AND (@phone IS NULL OR phone LIKE '%' + @phone + '%')
				AND (@isDelete IS NULL OR isDelete = @isDelete)
		)
		SELECT *
		FROM orders
		WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

		-- Tập kết quả 2: tổng số dòng
		SELECT COUNT(*) AS totalCount
		FROM dbo.[order] AS o
			WHERE 
				chatRoomId = @chatRoomId
				AND (@uuid IS NULL OR uuid = @uuid)
				AND (@moneyFrom IS NULL OR money >= @moneyFrom)
				AND (@moneyTo   IS NULL OR money <= @moneyTo)
				AND (@isPay IS NULL OR isPay = @isPay)
				AND (@phone IS NULL OR phone LIKE '%' + @phone + '%')
				AND (@isDelete IS NULL OR isDelete = @isDelete)
		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

-- BO
-- CREATE PROCEDURE GetMyOrderWithId
-- 	@id INT,
-- 	@accountId INT
-- AS
-- BEGIN
-- 	SELECT * FROM dbo.[order] WHERE status = 'normal' AND id = @id AND accountId = @accountId
-- END
-- GO

ALTER PROCEDURE GetOrderWithId
	@id INT
AS
BEGIN
	SELECT * FROM dbo.[order] WHERE id = @id AND isDelete = 0;
END
GO

ALTER PROCEDURE GetOrdersWithPhone
	@page INT,
    @size INT,
	@phone INT
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH orders AS (
        SELECT o.*,
			ROW_NUMBER() OVER (ORDER BY o.id DESC) AS rn
        FROM dbo.[order] AS o
		WHERE isDelete = 0 AND phone = @phone
    )
    SELECT *
    FROM orders
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.[order] AS o
	WHERE isDelete = 0 AND phone = @phone
END
GO

CREATE PROCEDURE GetAllOrderStatus
	@orderId INT
AS
BEGIN
	SELECT * FROM dbo.orderStatus WHERE orderId = @orderId ORDER BY id DESC
END
GO
