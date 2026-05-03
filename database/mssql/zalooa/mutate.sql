ALTER PROCEDURE CreateZaloOaToken
	@refreshToken NVARCHAR(MAX),
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

        INSERT INTO dbo.zaloOaToken (refreshToken, zaloOaId)
        VALUES (@refreshToken, @zaloOaId);
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo zaloOaToken không thành công.', 2;
        END

		SELECT * FROM dbo.chatSession WHERE zaloOaId = @zaloOaId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE UpdateRefreshTokenOfZaloOa
	@refreshToken NVARCHAR(MAX),
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

		-- UPDATE dbo.zaloOaToken WITH (ROWLOCK)
		UPDATE dbo.zaloOaToken
		SET refreshToken = @refreshToken
		WHERE zaloOaId = @zaloOaId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật refreshToken của zaloOa không thành công.', 2;
        END

		SELECT * FROM dbo.zaloOaToken WHERE zaloOaId = @zaloOaId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO