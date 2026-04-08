ALTER PROCEDURE Signup
	  @userName NVARCHAR(100),
	  @password NVARCHAR(100),
	  @phone NVARCHAR(15),
	  @firstName NVARCHAR(20),
	  @lastName NVARCHAR(20)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @newAccountId INT;

		INSERT INTO account (userName, password, phone, firstName, lastName, avatar, status, updateTime, createTime)
		VALUES (@userName, @password, @phone, @firstName, @lastName, NULL, 'normal', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Đăng ký tài khoản không thành công.', 1;
        END

		SET @newAccountId = SCOPE_IDENTITY();

		INSERT INTO dbo.recommend (myCode, yourCode, accountId)
        VALUES (LEFT(REPLACE(NEWID(), '-', ''), 10), NULL, @newAccountId);
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'Tạo mã giới thiệu không thành công.', 2;
        END

        INSERT INTO dbo.wallet (amount, type, accountId, updateTime, createTime)
        VALUES (0, '1', @newAccountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50003, 'Tạo ví 1 không thành công.', 3;
        END

		INSERT INTO dbo.wallet (amount, type, accountId, updateTime, createTime)
        VALUES (0, '2', @newAccountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            -- Không đủ tiền, rollback và trả lỗi
            THROW 50004, 'Tạo ví 2 không thành công.', 4;
        END

		SELECT * FROM dbo.account WHERE id = @newAccountId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

DELETE FROM account
GO

EXEC Signup N'laduchai1', N'passladuchai', N'0901234567', N'Hải', N'Lã';

-- bo
CREATE PROCEDURE CreateMember
	@userName NVARCHAR(100),
	@password NVARCHAR(100),
	@phone NVARCHAR(15),
	@firstName NVARCHAR(20),
	@lastName NVARCHAR(20),
	@addedById INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;
		DECLARE @newMemberId INT;

		-- Th�m medication
        INSERT INTO dbo.account (userName, password, phone, firstName, lastName, avatar, status, updateTime, createTime)
        VALUES (@userName, @password, @phone, @firstName, @lastName, null, 'normal', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

		SET @newMemberId = SCOPE_IDENTITY();

		INSERT INTO dbo.accountInformation (addedById, accountType, accountId)
        VALUES (@addedById, 'member', @newMemberId);

		SELECT * FROM dbo.account WHERE id = @newMemberId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE EditInforAccount
	@id INT,
	@firstName NVARCHAR(20),
    @lastName NVARCHAR(20),
    @avatar NVARCHAR(255) = NULL
AS
BEGIN
	UPDATE dbo.account
	SET firstName = @firstName, 
        lastName = @lastName, 
        avatar = ISNULL(@avatar, avatar)
	WHERE id = @id;

	IF @@ROWCOUNT > 0
	BEGIN
		SELECT * FROM dbo.account WHERE id = @id;
	END
END
GO

CREATE PROCEDURE ForgetPassword
	@userName NVARCHAR(100),
	@password NVARCHAR(100),
	@phone NVARCHAR(15)
AS
BEGIN
	UPDATE dbo.account
	SET password = @password
	WHERE 
		status = 'normal'
		AND userName = @userName 
		AND phone = @phone;

	IF @@ROWCOUNT > 0
    BEGIN
        SELECT * FROM dbo.account 
        WHERE 
            status = 'normal'
            AND userName = @userName 
            AND phone = @phone;
    END
END
GO

CREATE PROCEDURE CreateAccountInformation
	@accountType NVARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO dbo.accountInformation (addedById, accountType, accountId)
        VALUES (NULL, @accountType, @accountId);
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Thêm thông tin tài khoản không thành công.', 1;
        END

		SELECT * FROM dbo.accountInformation WHERE accountId = @accountId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE AddMemberV1
	@addedById INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE accountId = @addedById AND accountType = 'admin'
		)
		BEGIN
			THROW 50001, N'Không phải tài khoản admin .', 1;
		END

		IF EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE accountId = @accountId AND accountType = 'admin'
		)
		BEGIN
			THROW 50001, N'Thành viên thêm vào không được là 1 tài khoản admin .', 1;
		END

		-- thử UPDATE trước
		UPDATE dbo.accountInformation
		SET addedById = @addedById
		WHERE accountId = @accountId
		AND addedById IS NULL;

		-- nếu UPDATE thành công
		IF @@ROWCOUNT > 0
		BEGIN
			SELECT *
			FROM dbo.accountInformation
			WHERE accountId = @accountId;

			COMMIT TRANSACTION;
			RETURN;
		END

		-- nếu chưa có account thì INSERT
		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation
			WHERE accountId = @accountId
		)
		BEGIN
			INSERT INTO dbo.accountInformation (addedById, accountType, accountId)
			VALUES (@addedById, 'member', @accountId);

			SELECT *
			FROM dbo.accountInformation
			WHERE accountId = @accountId;
		END

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO


CREATE PROCEDURE CreateReplyAccount
	@authorizedAccountId NVARCHAR(255),
	@chatRoomId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRANSACTION;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.accountInformation ai1
			INNER JOIN dbo.accountInformation ai2 
				ON ai1.addedById = ai2.addedById
			WHERE ai1.accountId = @accountId
			  AND ai2.accountId = @authorizedAccountId
		)
		BEGIN
			THROW 50001, N'Không chung chung người quản lý.', 1;
		END

		-- 1) Check chatRoom có tồn tại không
		IF NOT EXISTS (
			SELECT 1
			FROM dbo.chatRoom
			WHERE 
				id = @chatRoomId
				AND accountId = @accountId
		)
		BEGIN
			THROW 50002, N'ChatRoom không tồn tại hoặc đã bị khóa.', 1;
		END

		-- 2) Check đã tồn tại role chưa (tránh insert trùng)
		IF EXISTS (
			SELECT 1
			FROM dbo.chatRoomRole
			WHERE 
				chatRoomId = @chatRoomId
				AND authorizedAccountId = @authorizedAccountId
		)
		BEGIN
			THROW 50003, N'Role này đã tồn tại trong chatRoom.', 1;
		END

		-- 3) Nếu pass hết check thì mới INSERT
		INSERT INTO dbo.chatRoomRole
			(authorizedAccountId, isRead, isSend, status, chatRoomId, accountId, updateTime, createTime)
		VALUES
			(@authorizedAccountId, 1, 0, 'normal', @chatRoomId, @accountId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Thêm chatRoomRole không thành công.', 4;
        END

		-- 4) Trả kết quả mới insert
		SELECT *
		FROM dbo.account
		WHERE status = 'normal' AND id = @authorizedAccountId

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE CreateAccountReceiveMessage
	@accountIdReceiveMessage INT = NULL,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRANSACTION;

		DECLARE @addedById INT
		SELECT @addedById = addedById FROM dbo.accountInformation WHERE accountId = @accountId;
		IF @addedById IS NULL
		BEGIN
			THROW 50001, N'Account này không có quyền thực hiện thao tác.', 1;
		END

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.zaloOa 
			WHERE id = @zaloOaId AND accountId = @addedById
		)
		BEGIN
			THROW 50002, N'Bạn không có quyền trên zaloOa này.', 2;
		END

		-- Th�m medication
        INSERT INTO dbo.accountReceiveMessage (accountIdReceiveMessage, zaloOaId, accountId)
        VALUES (@accountIdReceiveMessage, @zaloOaId, @accountId);
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Thêm accountReceiveMessage không thành công.', 3;
        END

		SELECT * FROM dbo.accountReceiveMessage WHERE accountId = @accountId AND zaloOaId = @zaloOaId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE UpdateAccountReceiveMessage
	@accountIdReceiveMessage INT = NULL,
	@zaloOaId INT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRANSACTION;

		DECLARE @addedById INT
		SELECT @addedById = addedById FROM dbo.accountInformation WHERE accountId = @accountId;
		IF @addedById IS NULL
		BEGIN
			THROW 50001, N'Account này không có quyền thực hiện thao tác.', 1;
		END

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.zaloOa 
			WHERE id = @zaloOaId AND accountId = @addedById
		)
		BEGIN
			THROW 50002, N'Bạn không có quyền trên zaloOa này.', 2;
		END

		UPDATE dbo.accountReceiveMessage
		SET accountIdReceiveMessage = @accountIdReceiveMessage
		WHERE accountId = @accountId AND zaloOaId = @zaloOaId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50003, 'Cập nhật accountReceiveMessage không thành công.', 3;
        END

		SELECT * FROM dbo.accountReceiveMessage WHERE accountId = @accountId AND zaloOaId = @zaloOaId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

ALTER PROCEDURE AddYourRecommend
	@yourCode VARCHAR(255),
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRANSACTION;

		DECLARE @rowCount INT;

		IF NOT EXISTS (
			SELECT 1
			FROM dbo.recommend 
			WHERE myCode = @yourCode
		)
		BEGIN
			THROW 50001, N'Mã này không tồn tại .', 1;
		END

		UPDATE dbo.recommend
		SET yourCode = @yourCode
		WHERE accountId = @accountId AND myCode <> @yourCode AND yourCode IS NULL 
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50002, N'Cập nhật mã giới thiệu không thành công', 2;
		END

		-- CAP NHAT TIEN
		DECLARE @my_accountId INT;
		DECLARE @your_accountId INT;
		SET @my_accountId = @accountId;
		SELECT @your_accountId = accountId FROM dbo.recommend WHERE myCode = @yourCode;

		DECLARE @my_walletId INT;
		DECLARE @your_walletId INT;
		SELECT @my_walletId = id FROM dbo.wallet WHERE accountId = @my_accountId AND type = '1';
		SELECT @your_walletId = id FROM dbo.wallet WHERE accountId = @your_accountId AND type = '1';
		IF @my_walletId IS NULL THROW 50003, N'Không tìm thấy ví của tôi', 3;
		IF @your_walletId IS NULL THROW 50004, N'Không tìm thấy ví người giới thiệu', 4;

		UPDATE dbo.wallet
		SET amount = amount + 25000, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @my_walletId
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50005, N'Cập nhật ví của tôi không thành công', 5;
		END

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (25000, 'recommend', NULL, @my_walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50006, N'Thêm biến động số dư của tôi không thành công', 6;
		END

		UPDATE dbo.wallet
		SET amount = amount + 25000, updateTime = SYSDATETIMEOFFSET()
		WHERE id = @your_walletId
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50007, N'Cập nhật ví của người giới thiệu không thành công', 7;
		END

		INSERT INTO dbo.balanceFluctuation (amount, type, payHookId, walletId, createTime)
        VALUES (25000, 'recommend', NULL, @your_walletId, SYSDATETIMEOFFSET());
		IF @@ROWCOUNT = 0
		BEGIN
			THROW 50008, N'Thêm biến động số dư của người giới thiệu không thành công', 8;
		END
		----

		SELECT * FROM dbo.recommend WHERE accountId = @accountId

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO