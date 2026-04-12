CREATE PROCEDURE CreateCacheRedis
	@key NVARCHAR(255),
	@value NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @newCacheRedisId INT;

        INSERT INTO dbo.cacheRedis ([key], value, updateTime, createTime)
        VALUES (@key, @value, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Cập nhật cacheRedis không thành công .', 1;
        END

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
		SELECT @cacheRedisId = id FROM dbo.cacheRedis WHERE [key] = @key 
		IF @cacheRedisId IS NULL THROW 50001, N'CacheRedis không tồn tại .', 1;

		UPDATE dbo.cacheRedis
		SET value = @value
		WHERE id = @cacheRedisId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật cacheRedis không thành công .', 2;
        END

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