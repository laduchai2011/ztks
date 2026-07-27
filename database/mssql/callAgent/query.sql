CREATE PROCEDURE GetCallAgentWithAccountId
	@accountId INT
AS
BEGIN
	SELECT * FROM dbo.callAgent WHERE isDelete = 0 AND accountId = @accountId
END
GO

CREATE PROCEDURE GetCallPermitWithUid
	@uid NVARCHAR(255)
AS
BEGIN
	SELECT * FROM dbo.callPermit WHERE isDelete = 0 AND uid = @uid
END
GO