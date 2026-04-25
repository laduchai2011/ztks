ALTER PROCEDURE CreateRegisterPost
	@name NVARCHAR(255), 
	@type VARCHAR(255), 
    @zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.accountInformation WHERE accountId = @accountId AND accountType = 'admin' )
		BEGIN
			THROW 50001, N'Không phải tài khoản admin .', 1;
		END

		DECLARE @registerPostId INT;

        INSERT INTO dbo.registerPost (name, type, zaloOaId, accountId, createTime)
        VALUES (@name, @type, @zaloOaId, @accountId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo đăng ký bài đăng không thành công.', 2;
        END

		SET @registerPostId = SCOPE_IDENTITY();

		SELECT * FROM dbo.registerPost WHERE id = @registerPostId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE EditRegisterPost
	@id INT,
	@name NVARCHAR(255), 
    @zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE accountId = @accountId AND id = @id )
		BEGIN
			THROW 50001, N'Đăng ký bài viết này không phải của bạn .', 1;
		END

		UPDATE dbo.registerPost
		SET name = @name, zaloOaId = @zaloOaId
		WHERE id = @id AND isDelete = 0
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Cập nhật đăng ký bài viết không thành công.', 2;
        END

		SELECT * FROM dbo.registerPost WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE DeleteRegisterPost
	@id INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE accountId = @accountId AND id = @id )
		BEGIN
			THROW 50001, N'Đăng ký bài viết này không phải của bạn .', 1;
		END

		UPDATE dbo.registerPost
		SET isDelete = 1
		WHERE id = @id AND isDelete = 0
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Xóa đăng ký bài viết không thành công.', 2;
        END

		SELECT * FROM dbo.registerPost WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE CreatePost
	@index INT,
	@name NVARCHAR(255), 
	@type VARCHAR(255),
	@title NVARCHAR(255), 
    @describe NVARCHAR(MAX),
	@images NVARCHAR(MAX),
	@isActive BIT,
	@registerPostId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE accountId = @accountId AND id = @registerPostId )
		BEGIN
			THROW 50001, N'Đăng ký bài viết này không phải của bạn .', 1;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE id = @registerPostId AND isDelete = 0 )
		BEGIN
			THROW 50002, N'Đăng ký bài viết này đã bị xóa .', 2;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE id = @registerPostId AND type = @type )
		BEGIN
			THROW 50003, N'Gói này đã hết hạn .', 3;
		END

		DECLARE @total_type INT;
		SELECT @total_type = COUNT(*) FROM dbo.post WHERE type = @type
		IF @total_type IS NOT NULL
		BEGIN
			IF @type = 'free'
			BEGIN
				IF @total_type > 10
				BEGIN
					THROW 50004, N'Số lượng bài đăng miễn phí không được quá 10 .', 4;
				END
			END
			IF @type = 'upgrade'
			BEGIN
				IF @total_type > 30
				BEGIN
					THROW 50005, N'Số lượng bài đăng miễn phí không được quá 30 .', 5;
				END
			END
		END
		
		DECLARE @newPostId INT;

        INSERT INTO dbo.post ([index], name, type, title, describe, images, isActive, registerPostId, createTime)
        VALUES (@index, @name, @type, @title, @describe, @images, @isActive, @registerPostId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50006, 'Tạo bài đăng không thành công.', 6;
        END

		SET @newPostId = SCOPE_IDENTITY();

		SELECT * FROM dbo.post WHERE id = @newPostId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE EditPost
	@id INT,
	@index INT,
	@name NVARCHAR(255),
	@title NVARCHAR(255),
	@describe NVARCHAR(MAX),
	@images NVARCHAR(MAX),
	@isActive BIT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @registerPostId INT;
		DECLARE @type VARCHAR(255);
		SELECT @registerPostId = registerPostId, @type = type FROM dbo.post WHERE id = @id
		IF @registerPostId IS NULL THROW 50001, N'Không tìm thấy registerPostId trong post .', 1;
		IF @type IS NULL THROW 50002, N'Không tìm thấy registerPostId trong post .', 2;

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE accountId = @accountId AND id = @registerPostId )
		BEGIN
			THROW 50003, N'Đăng ký bài viết này không phải của bạn .', 3;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE id = @registerPostId AND isDelete = 0 )
		BEGIN
			THROW 50004, N'Đăng ký bài viết này đã bị xóa .', 4;
		END

		IF NOT EXISTS ( SELECT 1 FROM dbo.registerPost WHERE id = @registerPostId AND type = @type )
		BEGIN
			THROW 50005, N'Gói này đã hết hạn .', 5;
		END

		UPDATE dbo.post
		SET [index] = @index, name = @name, title = @title, describe = @describe, images = @images, isActive = @isActive
		WHERE id = @id
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50006, 'Chỉnh sửa bài đăng không thành công .', 6;
        END

		SELECT * FROM dbo.post WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO