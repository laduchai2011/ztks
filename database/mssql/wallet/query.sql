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

CREATE PROCEDURE GetBalanceFluctuations
    @page INT,
    @size INT,
    @walletId INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

            WITH pagedDates AS (
                SELECT DISTINCT
                    CAST(
                        createTime AT TIME ZONE 'SE Asia Standard Time'
                        AS DATE
                    ) AS createDate
                FROM balanceFluctuation
                WHERE walletId = @walletId
                ORDER BY createDate DESC
                OFFSET (@page - 1) * @size ROWS
                FETCH NEXT @size ROWS ONLY
            )

            SELECT
                bf.id,
                bf.amount,
				bf.type,
                bf.payHookId,
                bf.voucherId,
                bf.orderId,
				bf.requireTakeMoneyId,
				bf.walletId,

                -- giờ Việt Nam
                bf.createTime AT TIME ZONE 'SE Asia Standard Time'
                    AS createTime

            FROM balanceFluctuation bf
            JOIN pagedDates d
                ON CAST(
                    bf.createTime AT TIME ZONE 'SE Asia Standard Time'
                    AS DATE
                ) = d.createDate
            WHERE walletId = @walletId
            ORDER BY
                bf.createTime AT TIME ZONE 'SE Asia Standard Time' DESC;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE MemberGetRequireTakeMoneyOfWallet
    @walletId INT,
	@accountId INT
AS
BEGIN
    SELECT * FROM dbo.requireTakeMoney
    WHERE walletId = @walletId AND accountId = @accountId AND isDelete = 0 AND isDo = 0
    ORDER BY createTime DESC;
END
GO

CREATE PROCEDURE MemberZtksGetRequiresTakeMoney
	@page INT,
	@size INT,
	@memberZtksId INT = NULL,
	@isDo BIT = NULL,
	@moneyFrom DECIMAL(20,2) = NULL,
    @moneyTo DECIMAL(20,2) = NULL,
	@doFromDate DATETIME2 = NULL,
    @doToDate DATETIME2 = NULL,
	@fromDate DATETIME2 = NULL,
    @toDate DATETIME2 = NULL
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH requireTakeMoneys AS (
        SELECT rtm.*,
			ROW_NUMBER() OVER (ORDER BY rtm.id ASC) AS rn
        FROM dbo.requireTakeMoney AS rtm
		WHERE 
			isDelete = 0
			AND (
				(@memberZtksId IS NULL AND memberZtksId IS NULL)
				OR memberZtksId = @memberZtksId
			)
			AND (@isDo IS NULL OR isDo = @isDo)
			AND (@moneyFrom IS NULL OR amount >= @moneyFrom)
			AND (@moneyTo   IS NULL OR amount <= @moneyTo)
			AND (@doFromDate IS NULL OR doTime >= @doFromDate)
			AND (@doToDate IS NULL OR doTime < @doToDate)
			AND (@fromDate IS NULL OR createTime >= @fromDate)
			AND (@toDate IS NULL OR createTime < @toDate)
    )
    SELECT *
    FROM requireTakeMoneys
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.requireTakeMoney AS rtm
	WHERE 
		isDelete = 0
		AND (
			(@memberZtksId IS NULL AND memberZtksId IS NULL)
			OR memberZtksId = @memberZtksId
		)
		AND (@isDo IS NULL OR isDo = @isDo)
		AND (@moneyFrom IS NULL OR amount >= @moneyFrom)
		AND (@moneyTo   IS NULL OR amount <= @moneyTo)
		AND (@doFromDate IS NULL OR doTime >= @doFromDate)
		AND (@doToDate IS NULL OR doTime < @doToDate)
		AND (@fromDate IS NULL OR createTime >= @fromDate)
		AND (@toDate IS NULL OR createTime < @toDate)
END
GO

CREATE PROCEDURE GetRequireWithId
	@id INT
AS
BEGIN
	SELECT * FROM dbo.requireTakeMoney WHERE id = @id;
END
GO

EXEC MemberZtksGetRequiresTakeMoney
    @page = 1,
    @size = 10

SELECT * FROM dbo.balanceFluctuation WHERE walletId = 2;