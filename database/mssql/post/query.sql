CREATE PROCEDURE GetRegisterPosts
	@page INT,
    @size INT,
	@isDelete BIT = NULL,
	@accountId INT
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH registerPosts AS (
        SELECT rp.*,
			ROW_NUMBER() OVER (ORDER BY rp.id DESC) AS rn
        FROM dbo.registerPost AS rp
		WHERE 
			(@isDelete IS NULL OR isDelete = @isDelete)
			AND accountId = @accountId
    )
    SELECT *
    FROM registerPosts
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.registerPost AS rp
	WHERE 
		(@isDelete IS NULL OR isDelete = @isDelete)
		AND accountId = @accountId
END
GO

CREATE PROCEDURE GetPosts
	@page INT,
    @size INT,
	@isActive BIT = NULL,
	@registerPostId INT
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH posts AS (
        SELECT p.*,
			ROW_NUMBER() OVER (ORDER BY p.id DESC) AS rn
        FROM dbo.post AS p
		WHERE 
			(@isActive IS NULL OR isActive = @isActive)
			AND registerPostId = @registerPostId
    )
    SELECT *
    FROM posts
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.post AS p
	WHERE 
		(@isActive IS NULL OR isActive = @isActive)
		AND registerPostId = @registerPostId
END
GO

CREATE PROCEDURE GetPostWithId
	@id INT
AS
BEGIN
	
    SELECT * FROM dbo.post WHERE id = @id
END
GO
