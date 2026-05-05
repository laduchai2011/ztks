ALTER PROCEDURE GetMyNotes
	@page INT,
    @size INT,
	@offset INT,
	@isDelete BIT = NULL,
	@chatRoomId INT,
    @accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRANSACTION;

			IF NOT EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE id = @chatRoomId AND accountId = @accountId )
			BEGIN
				THROW 50001, N'ChatRoom không tồn tại .', 1;
			END

			IF EXISTS ( SELECT 1 FROM dbo.chatRoom WHERE id = @chatRoomId AND status = 'delete' )
			BEGIN
				THROW 50002, N'ChatRoom đã bị xóa .', 2;
			END

			-- Tập kết quả 1: dữ liệu phân trang
			;WITH notes AS (
				SELECT n.*,
					ROW_NUMBER() OVER (ORDER BY n.id DESC) AS rn
				FROM dbo.note AS n
				WHERE 
					chatRoomId = @chatRoomId
					AND (@isDelete IS NULL OR isDelete = @isDelete)
			
			)
			SELECT *
			FROM notes
			WHERE rn BETWEEN (((@page - 1) * @size + 1) + @offset) AND ((@page * @size) + @offset);

			-- Tập kết quả 2: tổng số dòng
			SELECT COUNT(*) AS totalCount
			FROM dbo.note AS n
				WHERE 
					chatRoomId = @chatRoomId
					AND (@isDelete IS NULL OR isDelete = @isDelete)

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO