CREATE PROCEDURE UpdateStatistics
	@sales DECIMAL(20,2),
	@zaloOaId INT,
	@accountId INT,
	@ofDay Date
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;

		UPDATE dbo.[statisticsOa]
		SET sales = sales + @sales,
			orderAmount = orderAmount + 1
		WHERE zaloOaId = @zaloOaId AND ofDay = @ofDay;
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50001, 'Cập nhật doanh số không thành công.', 1;
		END;

		IF EXISTS (
			SELECT 1
			FROM dbo.[statisticsMemberInOneMonth]
			WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofMonth = DATEFROMPARTS(YEAR(@ofDay), MONTH(@ofDay), 1) AND flag = 'new'
		) 
		BEGIN
			UPDATE dbo.[statisticsMemberInOneMonth]
			SET sales = sales + @sales,
				orderAmount = orderAmount + 1
			WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofMonth = DATEFROMPARTS(YEAR(@ofDay), MONTH(@ofDay), 1) AND flag = 'new';
			IF @@ROWCOUNT = 0
			BEGIN
				THROW 50002, 'Cập nhật doanh số không thành công.', 2;
			END;
		END
		ELSE
		BEGIN
			INSERT INTO dbo.[statisticsMemberInOneMonth](sales, orderAmount, flag, ofMonth, zaloOaId, accountId, createTime)
			VALUES(@sales, 1, 'new', DATEFROMPARTS(YEAR(@ofDay), MONTH(@ofDay), 1), @zaloOaId, @accountId, SYSDATETIMEOFFSET());
			IF @@ROWCOUNT = 0
			BEGIN
				THROW 50003, 'Thêm chatRoomRole không thành công.', 3;
			END
		END

		SELECT * FROM dbo.[statisticsOa] WHERE zaloOaId = @zaloOaId;

	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO