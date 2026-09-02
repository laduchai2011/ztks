ALTER PROCEDURE CreateStatistics
	@sales DECIMAL(20,2),
	@zaloOaId INT,
	@accountId INT,
	@ofDay DATETIMEOFFSET(7)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;

		DECLARE @newStatisticsId INT;

		INSERT INTO dbo.[statistics] (sales, orderAmount, zaloOaId, accountId, ofDay, createTime)
        VALUES (@sales, 1, @zaloOaId, @accountId, @ofDay, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo doanh số không thành công.', 1;
        END		

		SET @newStatisticsId = SCOPE_IDENTITY();

		SELECT * FROM dbo.[statistics] WHERE id = @newStatisticsId

	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

ALTER PROCEDURE UpdateStatisticsWithNewOrder
	@sales DECIMAL(20,2),
	@zaloOaId INT,
	@accountId INT,
	@ofDay DATETIMEOFFSET(7)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;

		DECLARE @currentSales DECIMAL(20,2);

		SELECT @currentSales = sales
		FROM dbo.[statistics] WITH (UPDLOCK, ROWLOCK)
		WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofDay = @ofDay;

		IF @currentSales IS NULL
		BEGIN
			THROW 50001, 'Không tìm thấy statistics.', 1;
		END;

		UPDATE dbo.[statistics]
		SET sales = @currentSales + @sales,
			orderAmount = orderAmount + 1
		WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofDay = @ofDay;
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50002, 'Cập nhật doanh số không thành công.', 2;
		END;

		SELECT * FROM dbo.[statistics] WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofDay = @ofDay;

	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

ALTER PROCEDURE UpdateStatisticsWithOldOrder
	@sales DECIMAL(20,2),
	@zaloOaId INT,
	@accountId INT,
	@ofDay DATETIMEOFFSET(7)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;

		DECLARE @currentSales DECIMAL(20,2);

		SELECT @currentSales = sales
		FROM dbo.[statistics] WITH (UPDLOCK, ROWLOCK)
		WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofDay = @ofDay;

		IF @currentSales IS NULL
		BEGIN
			THROW 50001, 'Không tìm thấy statistics.', 1;
		END;

		UPDATE dbo.[statistics]
		SET sales = @currentSales + @sales
		WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofDay = @ofDay;
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50002, 'Cập nhật doanh số không thành công.', 2;
		END;

		SELECT * FROM dbo.[statistics] WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofDay = @ofDay;

	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO