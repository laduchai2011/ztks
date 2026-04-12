CREATE PROCEDURE CreateZaloOaToken
	@refreshToken NVARCHAR(MAX),
	@zaloOaId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO dbo.zaloOaToken (refreshToken, zaloOaId)
        VALUES (@refreshToken, @zaloOaId);
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Tạo zaloOaToken không thành công.', 1;
        END

		SELECT * FROM dbo.chatSession WHERE zaloOaId = @zaloOaId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE UpdateRefreshTokenOfZaloOa
	@refreshToken NVARCHAR(MAX),
	@zaloOaId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		-- UPDATE dbo.zaloOaToken WITH (ROWLOCK)
		UPDATE dbo.zaloOaToken
		SET refreshToken = @refreshToken
		WHERE zaloOaId = @zaloOaId
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Cập nhật refreshToken của zaloOa không thành công.', 1;
        END

		SELECT * FROM dbo.zaloOaToken WHERE zaloOaId = @zaloOaId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO