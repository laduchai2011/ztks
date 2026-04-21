CREATE PROCEDURE GetAllWallets 
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

CREATE PROCEDURE GetBalanceFluctuationLatestDay
    @walletId INT,
    @type VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM balanceFluctuation
    WHERE 
        walletId = @walletId
        AND CAST(SWITCHOFFSET(createTime, '+07:00') AS DATE) = (
            SELECT CAST(SWITCHOFFSET(MAX(createTime), '+07:00') AS DATE)
            FROM balanceFluctuation
            WHERE walletId = @walletId
        )
        AND (@type IS NULL OR type = @type)
		ORDER BY createTime DESC;
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
    ORDER BY createTime DESC;
END
GO

ALTER PROCEDURE MemberGetRequireTakeMoneyOfWallet
    @walletId INT,
	@accountId INT
AS
BEGIN
    SELECT * FROM dbo.requireTakeMoney
    WHERE walletId = @walletId AND accountId = @accountId AND isDelete = 0 AND isDo = 0
    ORDER BY createTime DESC;
END
GO