CREATE PROCEDURE GetStatisticsOa
	@fromDate DATE,
    @toDate DATE,
	@zaloOaId INT = NULL
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;

		SELECT *
		FROM dbo.[statisticsOa]
		WHERE ofDay >= CAST(@fromDate AS DATETIMEOFFSET)
		  AND ofDay < DATEADD(DAY, 1, CAST(@toDate AS DATETIMEOFFSET))
		  AND zaloOaId = @zaloOaId
		ORDER BY ofDay;

	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END

CREATE PROCEDURE GetStatisticsMemberInOneMonth
    @ofMonth DATE,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SELECT * FROM dbo.[statistics] WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofMonth = @ofMonth;
END