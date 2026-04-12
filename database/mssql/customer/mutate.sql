CREATE PROCEDURE CreateCustomer
	  @phone NVARCHAR(255),
	  @password NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @newAccountId INT;

		INSERT INTO dbo.customer (phone, password, createTime)
		VALUES (@phone, @password, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Đăng ký tài khoản không thành công.', 1;
        END

		SELECT * FROM dbo.customer WHERE phone = @phone;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE CustomerForgetPassword
	@phone NVARCHAR(255),
	@password NVARCHAR(255)
AS
BEGIN
	UPDATE dbo.customer
	SET password = @password
	WHERE phone = @phone;
	IF @@ROWCOUNT = 0
    BEGIN
		THROW 50001, 'Cập nhật mật khẩu không thành công.', 1;
    END

    SELECT * FROM dbo.customer WHERE phone = @phone;
END
GO