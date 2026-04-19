CREATE PROCEDURE GetBankWithId
	@id INT
AS
BEGIN
    SELECT * FROM dbo.bank WHERE id = @id
END
GO

CREATE PROCEDURE GetAllBanks
	@accountId INT
AS
BEGIN
    SELECT * FROM dbo.bank WHERE accountId = @accountId
END
GO