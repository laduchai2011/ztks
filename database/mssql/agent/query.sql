CREATE PROCEDURE GetAgentWithId
    @id INT
AS
BEGIN
	SELECT *
	FROM dbo.agent
	WHERE 
		status = 'normal' 
		AND id = @id
END
GO

CREATE PROCEDURE GetAgents
	@page INT,
	@size INT,
	@offset INT,
	@agentAccountId INT = NULL,
    @accountId INT
AS
BEGIN
    -- Tập kết quả 1: dữ liệu phân trang
    WITH agents AS (
        SELECT a.*,
			ROW_NUMBER() OVER (ORDER BY a.id DESC) AS rn
        FROM dbo.agent AS a
		WHERE 
			status = 'normal' 
			AND (@agentAccountId IS NULL OR agentAccountId = @agentAccountId)
			AND accountId = @accountId
    )
    SELECT *
    FROM agents
    WHERE rn BETWEEN (((@page - 1) * @size + 1) + @offset) AND ((@page * @size) + @offset);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.agent AS a
		WHERE 
			status = 'normal' 
			AND (@agentAccountId IS NULL OR agentAccountId = @agentAccountId)
			AND accountId = @accountId
END
GO

CREATE PROCEDURE GetAgentWithAgentAccountId
	@agentAccountId INT
AS
BEGIN
	 SELECT * FROM agent WHERE status = 'normal' AND agentAccountId = @agentAccountId
END
GO

CREATE PROCEDURE GetLastAgentPay
	@agentId INT,
	@accountId INT
AS
BEGIN
	SELECT TOP 1 *
	FROM dbo.agentPay
	WHERE agentId = @agentId AND accountId = @accountId
	ORDER BY createTime DESC
END
GO