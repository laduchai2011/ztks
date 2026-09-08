CREATE PROCEDURE GetMyCheckInOuts
    @fromDate DATE,
	@toDate DATE,
    @accountId INT
AS
BEGIN
	 DECLARE @firstDate DATE;

    -- Ngày tạo dữ liệu đầu tiên của account
    SELECT @firstDate = CAST(MIN(createTime) AS DATE)
    FROM checkInOut
    WHERE accountId = @accountId
      AND isDelete = 0;

    -- Nếu account chưa có dữ liệu
    IF @firstDate IS NULL
        RETURN;

    -- Không cho toDate nhỏ hơn ngày đầu tiên
    IF @toDate < @firstDate
        SET @toDate = @firstDate;

    WITH Dates AS (
        -- Bắt đầu từ hôm nay
        SELECT @fromDate AS [date]

        UNION ALL

        -- Đi ngược từng ngày
        SELECT DATEADD(DAY, -1, [date])
        FROM Dates
        WHERE [date] > @toDate
    )
    SELECT
        d.[date],
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
        AND c.createTime >= TODATETIMEOFFSET(
            CAST(d.[date] AS DATETIME2),
            '+07:00'
        )
        AND c.createTime < TODATETIMEOFFSET(
            CAST(DATEADD(DAY, 1, d.[date]) AS DATETIME2),
            '+07:00'
        )
    ORDER BY
        d.[date] DESC,
        c.createTime
    OPTION (MAXRECURSION 0);
END
GO