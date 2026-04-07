ALTER PROCEDURE CreateVoucher
	@dayAmount INT, 
	@money BIGINT, 
	@phone NVARCHAR(255),
    @memberZtksId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE accountId = @memberZtksId AND accountType = 'memberZtks'
		)
		BEGIN
			THROW 50001, N'Không phải tài khoản memberZtks .', 1;
		END

		DECLARE @newVoucherId INT;

        INSERT INTO dbo.voucher (isUsed, timeExpire, money, orderId, memberZtksId, phone, updateTime, createTime)
        VALUES (0, DATEADD(DAY, @dayAmount, SYSDATETIMEOFFSET()), @money, NULL, @memberZtksId, @phone, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo voucher không thành công.', 2;
        END

		SET @newVoucherId = SCOPE_IDENTITY();

		SELECT * FROM dbo.voucher WHERE id = @newVoucherId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO