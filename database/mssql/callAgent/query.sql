CREATE PROCEDURE GetCallAgentWithAccountId
	@accountId INT
AS
BEGIN
	SELECT * FROM dbo.callAgent WHERE isDelete = 0 AND accountId = @accountId
END
GO
