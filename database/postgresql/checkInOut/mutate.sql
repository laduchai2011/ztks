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

CREATE PROCEDURE CreateCheckInOutInspect
	@content NVARCHAR(255),
	@isPass BIT,
	@checkInOutId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE accountId = @accountId AND accountType = 'admin'
		)
		BEGIN
			THROW 50001, N'Không phải tài khoản admin .', 1;
		END

		DECLARE @accountId_member INT;
		SELECT @accountId_member = accountId FROM dbo.checkInOut WHERE id = @checkInOutId;
		IF @accountId_member IS NULL THROW 50002, N'Không thấy tài khoản nhân viên của check in/out này .', 2;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE addedById = @accountId AND accountId = @accountId_member
		)
		BEGIN
			THROW 50003, N'Không phải nhân viên của tài khoản này .', 3;
		END

		DECLARE @newCheckInOutInspectId INT;

        INSERT INTO dbo.checkInOutInspect (content, isPass, checkInOutId, accountId, updateTime, createTime)
        VALUES (@content, @isPass, @checkInOutId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Tạo CheckInOutInspect không thành công.', 4;
        END

		SET @newCheckInOutInspectId = SCOPE_IDENTITY();

		SELECT * FROM dbo.checkInOutInspect WHERE id = @newCheckInOutInspectId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO