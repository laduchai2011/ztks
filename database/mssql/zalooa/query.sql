DELETE FROM dbo.zaloOaToken
GO
DELETE FROM dbo.zaloOa
GO
DELETE FROM dbo.zaloApp
GO

CREATE PROCEDURE GetZaloAppWithAccountId
    @accountId INT
AS
BEGIN
	SELECT *
	FROM dbo.zaloApp
	WHERE 
		status = 'normal' 
		AND accountId = @accountId
END
GO

CREATE PROCEDURE GetZaloOaListWith2Fk
	@page INT,
    @size INT,
	@zaloAppId INT,
    @accountId INT
AS
BEGIN
	-- Tập kết quả 1: dữ liệu phân trang
    WITH zaloOas AS (
        SELECT zo.*,
			ROW_NUMBER() OVER (ORDER BY zo.id DESC) AS rn
        FROM dbo.zaloOa AS zo
		WHERE 
			status = 'normal'  
			AND (@zaloAppId IS NULL OR zo.zaloAppId = @zaloAppId) 
			AND (@accountId IS NULL OR zo.accountId = @accountId) 
    )
    SELECT *
    FROM zaloOas
    WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

    -- Tập kết quả 2: tổng số dòng
    SELECT COUNT(*) AS totalCount
	FROM dbo.zaloOa AS zo
		WHERE 
			status = 'normal' 
			AND (@zaloAppId IS NULL OR zo.zaloAppId = @zaloAppId) 
			AND (@accountId IS NULL OR zo.accountId = @accountId) 
END
GO

CREATE PROCEDURE IsMyOa
	@id INT,
    @accountId INT
AS
BEGIN
	SELECT *
	FROM dbo.zaloOa
	WHERE 
		status = 'normal' 
		AND id = @id
		AND accountId = @accountId
END
GO

ALTER PROCEDURE GetZaloOaWithId
	@id INT,
	@accountId INT
AS
BEGIN
	SELECT *
	FROM dbo.zaloOa
	WHERE 
		status = 'normal' 
		AND id = @id
		AND accountId = @accountId
END
GO

CREATE PROCEDURE CheckZaloAppWithAppId
    @appId NVARCHAR(255)
AS
BEGIN
	SELECT *
	FROM dbo.zaloApp
	WHERE 
		status = 'normal' 
		AND appId = @appId
END
GO

CREATE PROCEDURE CheckZaloOaListWithZaloAppId
    @zaloAppId INT
AS
BEGIN
	SELECT *
	FROM dbo.zaloOa
	WHERE 
		status = 'normal' 
		AND zaloAppId = @zaloAppId
END
GO

ALTER PROCEDURE GetZaloOaTokenWithFk
    @zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		IF NOT EXISTS ( SELECT 1 FROM dbo.zaloOa WHERE id = @zaloOaId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Không phải OA của bạn .', 1;
		END

		SELECT * FROM dbo.zaloOaToken WHERE zaloOaId = @zaloOaId

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE PlaywightGetZaloApp
    @userName NVARCHAR(100),
	@password NVARCHAR(100)
AS
BEGIN
	DECLARE @accountId INT;
	SELECT @accountId = id FROM dbo.account WHERE userName = @userName AND password=@password AND status = 'normal'
	IF @accountId IS NULL THROW 50001, N'Không tìm tài khoản', 1;

	SELECT * FROM dbo.zaloApp WHERE accountId = @accountId AND status = 'normal'
	SELECT @accountId AS accountId;
END
GO