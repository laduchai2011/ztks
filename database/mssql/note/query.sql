CREATE PROCEDURE GetMyNotes
	@page INT,
    @size INT,
	@offset INT,
	@chatRoomId INT = NULL,
	@zaloOaId INT = NULL,
    @accountId INT
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH notes AS (
        SELECT n.*,
			ROW_NUMBER() OVER (ORDER BY n.id DESC) AS rn
        FROM dbo.note AS n
		WHERE 
			status = 'normal' 
			AND (@chatRoomId IS NULL OR chatRoomId = @chatRoomId)
			AND (@zaloOaId IS NULL OR zaloOaId = @zaloOaId)
			AND accountId = @accountId 
    )
    SELECT *
    FROM notes
    WHERE rn BETWEEN (((@page - 1) * @size + 1) + @offset) AND ((@page * @size) + @offset);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.note AS n
		WHERE 
			status = 'normal' 
			AND (@chatRoomId IS NULL OR chatRoomId = @chatRoomId)
			AND (@zaloOaId IS NULL OR zaloOaId = @zaloOaId)
			AND accountId = @accountId 
END
GO