CREATE PROCEDURE CreateCheckInOut
	@type NVARCHAR(255),
	@note NVARCHAR(255),
	@image NVARCHAR(255) = NULL,
	@video NVARCHAR(255) = NULL,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @newCheckInOutId INT;

        INSERT INTO dbo.checkInOut (type, note, image, video, accountId, createTime)
        VALUES (@type, @note, @image, @video, @accountId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo CheckInOut không thành công.', 1;
        END

		SET @newCheckInOutId = SCOPE_IDENTITY();

		SELECT * FROM dbo.checkInOut WHERE id = @newCheckInOutId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO