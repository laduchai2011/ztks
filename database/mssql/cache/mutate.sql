CREATE PROCEDURE CreateCacheRedis
	@key NVARCHAR(255),
	@value NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @newCacheRedisId INT;

		-- Thêm medication
        INSERT INTO dbo.cacheRedis ([key], value, updateTime, createTime)
        VALUES (@key, @value, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SET @newCacheRedisId = SCOPE_IDENTITY();

		SELECT * FROM dbo.cacheRedis WHERE id = @newCacheRedisId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE UpdateValue_CacheRedis
	@key NVARCHAR(255),
	@value NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @cacheRedisId INT;

		SELECT @cacheRedisId = id
        FROM dbo.cacheRedis
        WHERE 
			[key] = @key 

		UPDATE dbo.cacheRedis
		SET value = @value
		WHERE id = @cacheRedisId;

		SELECT * FROM dbo.cacheRedis WHERE id = @cacheRedisId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

delete dbo.cacheRedis