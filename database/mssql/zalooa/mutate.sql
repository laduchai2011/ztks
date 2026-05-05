ALTER PROCEDURE CreateZaloOa
	@label NVARCHAR(255),
	@oaId NVARCHAR(255),
	@oaName NVARCHAR(255),
	@oaSecret NVARCHAR(255),
	@zaloAppId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.zaloApp WHERE id = @zaloAppId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Không phải zaloApp của bạn .', 1;
		END

		DECLARE @newZaloOaId INT;

        INSERT INTO dbo.zaloOa (label, oaId, oaName, oaSecret, status, zaloAppId, accountId, updateTime, createTime)
        VALUES (@label, @oaId, @oaName, @oaSecret, 'normal', @zaloAppId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo zaloOa không thành công.', 2;
        END

		SET @newZaloOaId = SCOPE_IDENTITY();

		SELECT * FROM dbo.zaloOa WHERE id = @newZaloOaId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE EditZaloOa
	@id INT, 
	@label NVARCHAR(255),
	@oaId NVARCHAR(255),
	@oaName NVARCHAR(255),
	@oaSecret NVARCHAR(255),
	@zaloAppId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.zaloApp WHERE id = @zaloAppId AND accountId = @accountId )
		BEGIN
			THROW 50001, N'Không phải zaloApp của bạn .', 1;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.zalooA WHERE id = @id AND zaloAppId = @zaloAppId )
		BEGIN
			THROW 50002, N'OA không phải của zaloApp này .', 2;
		END

		UPDATE dbo.zaloOa
		SET label = @label, oaId = @oaId, oaName = @oaName, oaSecret = @oaSecret, updateTime = SYSDATETIMEOFFSET()
		WHERE status = 'normal' AND id = @id
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Cập nhật zaloOa không thành công.', 3;
        END

		SELECT * FROM dbo.zaloOa WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

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

ALTER PROCEDURE CreateZnsTemplate
	@temId NVARCHAR(255),
	@images NVARCHAR(MAX),
	@dataFields NVARCHAR(MAX),
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

		DECLARE @znsTemplateId INT;

        INSERT INTO dbo.znsTemplate (temId, images, dataFields, isDelete, zaloOaId, updateTime, createTime)
        VALUES (@temId, @images, @dataFields, 0, @zaloOaId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo znsTemplate không thành công.', 2;
        END

		SET @znsTemplateId = SCOPE_IDENTITY();

		SELECT * FROM dbo.znsTemplate WHERE id = @znsTemplateId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE EditZnsTemplate
	@id INT,
	@temId NVARCHAR(255),
	@images NVARCHAR(MAX),
	@dataFields NVARCHAR(MAX),
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

		IF NOT EXISTS ( SELECT 1 FROM dbo.znsTemplate WHERE id = @id AND zaloOaId = @zaloOaId )
		BEGIN
			THROW 50002, N'Không tồn tại znsTemplate này .', 2;
		END

		UPDATE dbo.znsTemplate
		SET temId = @temId, images = @images, dataFields = @dataFields
		WHERE id = @id AND isDelete = 0
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Cập nhật znsTemplate của zaloOa không thành công.', 3;
        END

		SELECT * FROM dbo.znsTemplate WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO