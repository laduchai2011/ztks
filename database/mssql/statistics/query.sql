ALTER PROCEDURE GetStatistics
	@fromDate DATETIMEOFFSET(7) = NULL,
    @toDate DATETIMEOFFSET(7) = NULL,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
	BEGIN TRANSACTION;

		SELECT *
		FROM dbo.[statistics]
		WHERE ofDay >= CAST(@fromDate AS DATETIMEOFFSET)
		  AND ofDay < DATEADD(DAY, 1, CAST(@toDate AS DATETIMEOFFSET))
		  AND zaloOaId = @zaloOaId AND accountId = @accountId
		ORDER BY ofDay;

	COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END

CREATE PROCEDURE GetStatisticsOfDay
    @ofDay DATETIMEOFFSET(7) = NULL,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SELECT * FROM dbo.[statistics] WHERE accountId = @accountId AND zaloOaId = @zaloOaId AND ofDay = @ofDay;
END