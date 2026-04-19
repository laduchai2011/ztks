CREATE PROCEDURE GetBankWithId
	@id INT
AS
BEGIN
    SELECT * FROM dbo.bank WHERE id = @id AND isDelete = 0
END
GO

CREATE PROCEDURE GetAllBanks
	@accountId INT
AS
BEGIN
    SELECT * FROM dbo.bank WHERE accountId = @accountId AND isDelete = 0
END
GO