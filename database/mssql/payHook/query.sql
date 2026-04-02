ALTER PROCEDURE GetPayHooks
	@page INT,
    @size INT,
	@referenceCode VARCHAR = NULL,
    @agentPayId INT = NULL,
	@orderId INT = NULL,
	@walletId INT = NULL
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH payHooks AS (
        SELECT p.*,
			ROW_NUMBER() OVER (ORDER BY p.transactionDate DESC) AS rn
        FROM dbo.payHook AS p
		WHERE 
			(@referenceCode IS NULL OR referenceCode = @referenceCode)
			AND (@agentPayId IS NULL OR agentPayId = @agentPayId)
			AND (@orderId IS NULL OR orderId = @orderId)
			AND (@walletId IS NULL OR walletId = @walletId)
    )
    SELECT *
    FROM payHooks
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.payHook AS p
	WHERE 
		(@referenceCode IS NULL OR referenceCode = @referenceCode)
		AND (@agentPayId IS NULL OR agentPayId = @agentPayId)
		AND (@orderId IS NULL OR orderId = @orderId)
		AND (@walletId IS NULL OR walletId = @walletId)
END
GO