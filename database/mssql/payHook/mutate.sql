CREATE PROCEDURE CreatePayHook
	@id INT,
    @gateway varchar(255),
    @transactionDate DATETIME,
    @accountNumber varchar(255),
    @subAccount varchar(255),
	@code varchar(255),
	@content varchar(255),
	@transferType varchar(255),
	@description varchar(255),
	@transferAmount decimal(20,2),
	@referenceCode varchar(255),
    @accumulated decimal(20,2),
	@agentPayId INT,
	@orderId INT,
	@walletId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO dbo.payHook (id, gateway, transactionDate, accountNumber, subAccount, code, content, transferType, description, transferAmount, referenceCode, accumulated, agentPayId, orderId, walletId)
        VALUES (@id, @gateway, @transactionDate, @accountNumber, @subAccount, @code, @content, @transferType, @description, @transferAmount, @referenceCode, @accumulated, @agentPayId, @orderId, @walletId)
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo payHook không thành công .', 1;
        END

		SELECT * FROM dbo.payHook WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO