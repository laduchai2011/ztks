ALTER PROCEDURE GetAllWallets 
	@type VARCHAR(8),
    @accountId INT
AS
BEGIN
    SELECT * FROM dbo.wallet 
		WHERE 
			type = @type
			AND accountId = @accountId
END
GO

ALTER PROCEDURE GetbalanceFluctuations 
	@page INT,
    @size INT,
	@type VARCHAR(255) = NULL,
    @walletId INT
AS
BEGIN
    -- Tập kết quả 1: dữ liệu phân trang
    WITH balanceFluctuations AS (
        SELECT b.*,
			ROW_NUMBER() OVER (ORDER BY b.id DESC) AS rn
        FROM dbo.balanceFluctuation AS b
		WHERE 
			(@type IS NULL OR type = @type)
			AND walletId = @walletId
    )
    SELECT *
    FROM dbo.balanceFluctuations
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.balanceFluctuations AS b
	WHERE 
		(@type IS NULL OR type = @type)
		AND walletId = @walletId
END
GO