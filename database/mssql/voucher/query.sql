ALTER PROCEDURE GetVouchers
	@page INT,
    @size INT,
	@isUsed BIT = NULL,
	@phone NVARCHAR(255)
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH vouchers AS (
        SELECT v.*,
			ROW_NUMBER() OVER (ORDER BY v.id DESC) AS rn
        FROM dbo.voucher AS v
		WHERE 
			(@isUsed IS NULL OR isUsed = @isUsed)
			AND phone = @phone
    )
    SELECT *
    FROM vouchers
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.voucher AS v
	WHERE 
		(@isUsed IS NULL OR isUsed = @isUsed)
		AND phone = @phone
END
GO

CREATE PROCEDURE GetVoucherWithOrderId
	@orderId INT
AS
BEGIN
	SELECT * FROM dbo.voucher WHERE orderId = @orderId
END
GO