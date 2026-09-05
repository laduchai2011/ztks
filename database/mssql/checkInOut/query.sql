CREATE PROCEDURE GetMyCheckInOuts
    @fromDate DATE,
	@toDate DATE,
    @accountId INT
AS
BEGIN
	WITH Dates AS (
    SELECT @fromDate AS [date]

    UNION ALL

    SELECT DATEADD(DAY, 1, [date])
    FROM Dates
    WHERE [date] < @toDate
	)
	SELECT
		c.id,
		c.type,
		c.note,
		c.image,
		c.video,
		c.createTime
	FROM Dates d
	LEFT JOIN checkInOut c
		ON c.accountId = @accountId
		AND c.isDelete = 0
		AND c.createTime >= TODATETIMEOFFSET(CAST(d.[date] AS DATETIME2),'+07:00')
		AND c.createTime < TODATETIMEOFFSET(CAST(DATEADD(DAY, 1, d.[date]) AS DATETIME2),'+07:00')
	ORDER BY
		d.[date],
		c.createTime
	OPTION (MAXRECURSION 0);
END
GO