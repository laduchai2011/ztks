CREATE PROCEDURE GetCallAgentWithAccountId
	@accountId INT
AS
BEGIN
	SELECT * FROM dbo.callAgent WHERE isDelete = 0 AND accountId = @accountId
END
GO

CREATE PROCEDURE GetAgentCodeFromUid
	@uid NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @callAgentId INT;
    SELECT @callAgentId = callAgentId FROM dbo.callPermit WHERE isDelete = 0 AND uid = @uid;

    SELECT agentCode FROM dbo.callAgent WHERE id = @callAgentId;
END
GO

CREATE PROCEDURE GetTrunkCodeFromUid
	@uid NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @zaloTrunkId INT;
    SELECT @zaloTrunkId = zaloTrunkId FROM dbo.callPermit WHERE isDelete = 0 AND uid = @uid;
	IF @zaloTrunkId IS NULL THROW 50003, N'ZaloTrunk không tồn tại .', 3;

    SELECT trunkCode FROM dbo.zaloTrunk WHERE id = @zaloTrunkId;
END
GO

CREATE PROCEDURE GetDomainFromUid
	@uid NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @zaloTrunkId INT;
    SELECT @zaloTrunkId = zaloTrunkId FROM dbo.callPermit WHERE isDelete = 0 AND uid = @uid;
	IF @zaloTrunkId IS NULL THROW 50003, N'ZaloTrunk không tồn tại .', 3;

    SELECT domain FROM dbo.zaloTrunk WHERE id = @zaloTrunkId;
END
GO

CREATE PROCEDURE GetCallPermitWithUid
	@uid NVARCHAR(255)
AS
BEGIN
	SELECT * FROM dbo.callPermit WHERE isDelete = 0 AND uid = @uid
END
GO