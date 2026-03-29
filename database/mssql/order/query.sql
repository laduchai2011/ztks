CREATE PROCEDURE GetOrders
	@page INT,
    @size INT,
	@uuid NVARCHAR(255) = NULL,
	@moneyFrom BIGINT = NULL,
    @moneyTo BIGINT = NULL,
	@isPay BIT = NULL,
	@phone NVARCHAR(255) = NULL,
	@chatRoomId INT = NULL,
	@zaloOaId INT = NULL,
    @accountId INT
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH orders AS (
        SELECT o.*,
			ROW_NUMBER() OVER (ORDER BY o.id DESC) AS rn
        FROM dbo.[order] AS o
		WHERE 
			status = 'normal' 
			AND (@uuid IS NULL OR uuid = @uuid)
			AND (@moneyFrom IS NULL OR money >= @moneyFrom)
			AND (@moneyTo   IS NULL OR money <= @moneyTo)
			AND (@isPay IS NULL OR isPay = @isPay)
			AND (@phone IS NULL OR phone LIKE '%' + @phone + '%')
			AND (@chatRoomId IS NULL OR chatRoomId = @chatRoomId)
			AND (@zaloOaId IS NULL OR zaloOaId = @zaloOaId)
			AND accountId = @accountId
    )
    SELECT *
    FROM orders
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.[order] AS o
		WHERE 
			status = 'normal' 
			AND (@uuid IS NULL OR uuid = @uuid)
			AND (@moneyFrom IS NULL OR money >= @moneyFrom)
			AND (@moneyTo   IS NULL OR money <= @moneyTo)
			AND (@isPay IS NULL OR isPay = @isPay)
			AND (@phone IS NULL OR phone LIKE '%' + @phone + '%')
			AND (@chatRoomId IS NULL OR chatRoomId = @chatRoomId)
			AND (@zaloOaId IS NULL OR zaloOaId = @zaloOaId)
			AND accountId = @accountId
END
GO

CREATE PROCEDURE GetMyOrderWithId
	@id INT,
	@accountId INT
AS
BEGIN
	SELECT * FROM dbo.[order] WHERE status = 'normal' AND id = @id AND accountId = @accountId
END
GO

CREATE PROCEDURE GetOrderWithId
	@id INT
AS
BEGIN
	SELECT * FROM dbo.[order] WHERE status = 'normal' AND id = @id;
END
GO

CREATE PROCEDURE GetAllOrderStatus
	@orderId INT
AS
BEGIN
	SELECT * FROM dbo.orderStatus WHERE orderId = @orderId ORDER BY id DESC
END
GO
