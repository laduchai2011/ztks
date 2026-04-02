ALTER PROCEDURE GetAllWallets 
	@accountId INT
AS
BEGIN
    SELECT * FROM dbo.wallet WHERE  accountId = @accountId
END
GO

CREATE PROCEDURE GetMyWalletWithType
	@type VARCHAR(8),
	@accountId INT
AS
BEGIN
    SELECT * FROM dbo.wallet WHERE  accountId = @accountId AND type = @type
END
GO

-- bo
ALTER PROCEDURE GetBalanceFluctuations 
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
    FROM balanceFluctuations
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.balanceFluctuations AS b
	WHERE 
		(@type IS NULL OR type = @type)
		AND walletId = @walletId
END
GO

CREATE PROCEDURE GetBalanceFluctuationsByDate
    @walletId INT,
	@type VARCHAR(255) = NULL,
    @fromDate DATETIME2,
    @toDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM balanceFluctuation
    WHERE 
        walletId = @walletId
		AND (@type IS NULL OR type = @type)
        AND createTime >= @fromDate
        AND createTime < @toDate
    ORDER BY id DESC;
END
GO