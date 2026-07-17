CREATE PROCEDURE GetMyCallAgent
    @id INT, 
	@accountId INT
AS
BEGIN
	SELECT * FROM dbo.callAgent WHERE isDelete = 0 AND id = @id AND accountId = @accountId
END
GO
