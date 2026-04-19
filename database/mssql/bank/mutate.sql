CREATE PROCEDURE AddBank
	@bankCode VARCHAR(255), 
	@accountNumber VARCHAR(255),
    @accountName VARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @newBankId INT;

        INSERT INTO dbo.bank (bankCode, accountNumber, accountName, accountId, updateTime, createTime)
        VALUES (@bankCode, @accountNumber, @accountName, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Thêm thông tin tài khoản không thành công .', 1;
        END

		SET @newBankId = SCOPE_IDENTITY();

		SELECT * FROM dbo.bank WHERE id = @newBankId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE EditBank
	@id INT,
	@bankCode VARCHAR(255), 
	@accountNumber VARCHAR(255),
    @accountName VARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.bank WHERE accountId = @accountId AND id = @id )
		BEGIN
			THROW 50001, N'Ngân hàng nay không phải của bạn .', 1;
		END

		UPDATE dbo.bank
		SET bankCode = @bankCode, accountNumber = @accountNumber, accountName = @accountName, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @id AND isDelete = 0
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50002, 'Thay đổi thông tin ngân hàng thất bại .', 2;
		END

		SELECT * FROM dbo.bank WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE DeleteBank
	@id INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.bank WHERE accountId = @accountId AND id = @id )
		BEGIN
			THROW 50001, N'Ngân hàng nay không phải của bạn .', 1;
		END

		UPDATE dbo.bank
		SET isDelete = 1, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @id AND isDelete = 0
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50002, 'Xóa thông tin ngân hàng thất bại .', 2;
		END

		SELECT * FROM dbo.bank WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO