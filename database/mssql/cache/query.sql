CREATE PROCEDURE GetACacheRedisWithKey
	@key NVARCHAR(255)
AS
BEGIN
    SELECT *
    FROM dbo.cacheRedis
    WHERE [key] = @key
END
GO