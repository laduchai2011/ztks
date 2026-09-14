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
        --RETURN;
	BEGIN
		SELECT
			CAST(NULL AS DATE) AS [date],
			CAST(NULL AS INT) AS id,
			CAST(NULL AS NVARCHAR(255)) AS type,
			CAST(NULL AS NVARCHAR(255)) AS note,
			CAST(NULL AS NVARCHAR(255)) AS image,
			CAST(NULL AS NVARCHAR(255)) AS video,
			CAST(NULL AS DATETIMEOFFSET(7)) AS createTime
		WHERE 1 = 0;

		RETURN;
	END;

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
		c.isDelete,
		@accountId as accountId,
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

CREATE PROCEDURE GetCheckInOutsWithDate
	@type NVARCHAR(255),
	@date DATE,
    @accountId INT
AS
BEGIN
	 SELECT
		id,
		type,
		note,
		image,
		video,
		isDelete,
		accountId,
		createTime
	FROM dbo.checkInOut
	WHERE accountId = @accountId
		AND type = @type
		AND isDelete = 0
		AND createTime >= CAST(@date AS DATETIMEOFFSET)
		AND createTime < DATEADD(DAY, 1, CAST(@date AS DATETIMEOFFSET))
	ORDER BY createTime ASC;
END
GO

CREATE PROCEDURE GetCheckInOutInspectWithFk
    @checkInOutId INT
AS
BEGIN
	 SELECT * FROM dbo.checkInOutInspect WHERE checkInOutId = @checkInOutId AND isDelete = 0;
END
GO