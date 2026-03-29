CREATE FUNCTION GetMyCustemerIdWithSenderId (@senderId NVARCHAR(255)) RETURNS TABLE AS RETURN (
    SELECT
        *
    FROM
        dbo.myCustomer
    WHERE
		status = 'normal' 
        AND senderId = @senderId     
);
GO

CREATE PROCEDURE GetMyCustomers
	@page INT,
    @size INT,
    @accountId INT
AS
BEGIN
	-- -- Tập kết quả 1: dữ liệu phân trang
    -- WITH myCustoms AS (
    --     SELECT mc.*,
	-- 		--ROW_NUMBER() OVER (ORDER BY mc.id DESC) AS rn
	-- 		ROW_NUMBER() OVER (ORDER BY ISNULL(MAX(i.id), 0) DESC) AS rn
    --     FROM dbo.myCustomer AS mc
	-- 	LEFT JOIN dbo.isNewMessage i ON mc.id = i.myCustomerId
	-- 	WHERE 
	-- 		status = 'normal' 
	-- 		AND (@accountId IS NULL OR mc.accountId = @accountId) 
    -- )
    -- SELECT *
    -- FROM myCustoms
    -- WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- -- Tập kết quả 2: tổng số dòng
    -- SELECT COUNT(*) AS totalCount
	-- FROM dbo.myCustomer AS mc
	-- 	WHERE 
	-- 		status = 'normal' 
	-- 		AND (@accountId IS NULL OR mc.accountId = @accountId) 
	-- CTE lấy id tin nhắn mới nhất cho từng customer
    ;WITH LatestMsg AS (
        SELECT 
            myCustomerId, 
            MAX(id) AS lastMsgId
        FROM isNewMessage
        GROUP BY myCustomerId
    ),
    myCustoms AS (
        SELECT 
            mc.*,
            ROW_NUMBER() OVER (
                ORDER BY ISNULL(lm.lastMsgId, 0) DESC
            ) AS rn
        FROM dbo.myCustomer mc
        LEFT JOIN LatestMsg lm ON mc.id = lm.myCustomerId
        WHERE 
            mc.status = 'normal'
            AND (@accountId IS NULL OR mc.accountId = @accountId)
    )
    SELECT *
    FROM myCustoms
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tổng số dòng
    SELECT COUNT(*) AS totalCount
    FROM dbo.myCustomer mc
    WHERE 
        mc.status = 'normal'
        AND (@accountId IS NULL OR mc.accountId = @accountId);
END
GO


CREATE PROCEDURE GetAllMyCustomers
    @accountId INT
AS
BEGIN
	--SELECT 
    --mc.*,
    --ROW_NUMBER() OVER (ORDER BY mc.id DESC) AS rn
	--FROM myCustomer AS mc
	--WHERE mc.accountId = @accountId
	--ORDER BY mc.id DESC;
	SELECT a.*
	FROM myCustomer a
	LEFT JOIN isNewMessage b ON a.id = b.myCustomerId
	WHERE 
		a.status = 'normal' 
		AND (@accountId IS NULL OR a.accountId = @accountId) 
	ORDER BY b.myCustomerId DESC
END
GO

CREATE PROCEDURE GetAMyCustomer
	@senderId NVARCHAR(255)
AS
BEGIN
	SELECT * FROM dbo.myCustomer AS mc
	WHERE 
		status = 'normal' 
		AND (@senderId IS NULL OR mc.senderId = @senderId) 
END
GO

CREATE PROCEDURE GetAIsNewMessage
	@myCustomerId INT
AS
BEGIN
	SELECT * FROM dbo.isNewMessage
	WHERE @myCustomerId IS NULL OR myCustomerId = @myCustomerId
    ORDER BY id DESC 
END
GO