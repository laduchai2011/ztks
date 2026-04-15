CREATE FUNCTION Signin (@userName NVARCHAR(100), @password NVARCHAR(100)) RETURNS TABLE AS RETURN (
    SELECT
        *
    FROM
        dbo.account
    WHERE
        userName = @userName
        AND password = @password
);
GO

CREATE PROCEDURE CheckForgetPassword
    @userName NVARCHAR(100),
	@phone NVARCHAR(15)
AS
BEGIN
	SELECT *
	FROM dbo.account
	WHERE 
		status = 'normal' 
		AND userName = @userName
		AND phone = @phone
END
GO


CREATE PROCEDURE GetMembers
	@page INT,
    @size INT,
	@searchedAccountId INT = NULL,
    @accountId INT
AS
BEGIN
	DECLARE @addedById INT;

	SELECT @addedById = addedById FROM dbo.accountInformation WHERE accountId = @accountId

	IF @addedById IS NOT NULL
	BEGIN
		WITH accounts AS (
			SELECT a.*,
				ROW_NUMBER() OVER (ORDER BY a.id DESC) AS rn
			FROM dbo.account AS a
			JOIN accountInformation ai ON ai.accountId = a.id
			WHERE 
				a.status = 'normal' 
				AND ai.addedById = @addedById
				AND (@searchedAccountId IS NULL OR a.id = @searchedAccountId)
		)
		SELECT *
		FROM accounts
		WHERE rn BETWEEN ((@page - 1) * @size + 1) AND (@page * @size);

		-- Tập kết quả 2: tổng số dòng
		SELECT COUNT(*) AS totalCount
		FROM dbo.account AS a
		JOIN accountInformation ai ON ai.accountId = a.id
		WHERE 
			a.status = 'normal' 
			AND ai.addedById = @addedById
			AND (@searchedAccountId IS NULL OR a.id = @searchedAccountId)
	END
END
GO

CREATE PROCEDURE GetAllMembers
    @addedById INT
AS
BEGIN
	SELECT a.*
	FROM account a
	JOIN accountInformation ai ON ai.accountId = a.id
	WHERE 
		a.status = 'normal' 
		AND (@addedById IS NULL OR ai.addedById = @addedById) 
END
GO

CREATE PROCEDURE GetAccountInformation
    @id INT
AS
BEGIN
	SELECT ai.*
	FROM accountInformation ai
	JOIN account a ON a.id = ai.accountId
	WHERE 
		a.status = 'normal' 
		AND (@id IS NULL OR ai.accountId = @id) 
END
GO
--> chuyen sang dung
ALTER PROCEDURE GetMyAccountInformation
    @accountId INT
AS
BEGIN
	SELECT * FROM accountInformation WHERE accountId = @accountId
END
GO

CREATE PROCEDURE GetMe
    @id INT
AS
BEGIN
	SELECT *
	FROM dbo.account
	WHERE 
		status = 'normal' 
		AND id = @id
END
GO

CREATE PROCEDURE GetAccountWithId
    @id INT
AS
BEGIN
	SELECT *
	FROM dbo.account
	WHERE 
		status = 'normal' 
		AND id = @id
END
GO


--  WITH chatRoomRole
CREATE PROCEDURE GetReplyAccounts
	@page INT,
	@size INT,
    @chatRoomId INT
AS
BEGIN
	SELECT a.*
	FROM dbo.account a
	INNER JOIN dbo.chatRoomRole crr ON crr.authorizedAccountId = a.id
	WHERE a.status = 'normal' AND crr.status = 'normal' AND crr.chatRoomId = @chatRoomId
	ORDER BY
	(
		SELECT STRING_AGG(s.value, ' ') WITHIN GROUP (ORDER BY s.ordinal DESC)
		FROM STRING_SPLIT(LTRIM(RTRIM(a.lastName)), ' ', 1) s
	) COLLATE Vietnamese_100_CI_AI,
	(
		SELECT STRING_AGG(s.value, ' ') WITHIN GROUP (ORDER BY s.ordinal DESC)
		FROM STRING_SPLIT(LTRIM(RTRIM(a.firstName)), ' ', 1) s
	) COLLATE Vietnamese_100_CI_AI,
	a.id ASC
	OFFSET (@page - 1) * @size ROWS
	FETCH NEXT @size ROWS ONLY;

	SELECT COUNT(*) AS totalCount
	FROM dbo.account a
	INNER JOIN dbo.chatRoomRole crr ON crr.authorizedAccountId = a.id
	WHERE a.status = 'normal' AND crr.status = 'normal' AND crr.chatRoomId = @chatRoomId
END
GO 

CREATE PROCEDURE GetNotReplyAccounts
	@page INT,
	@size INT,
    @chatRoomId INT,
	@accountId INT
AS
BEGIN
	DECLARE @addedById INT;

    SELECT @addedById = ai.addedById
    FROM dbo.accountInformation ai
    WHERE ai.accountId = @accountId;

    SELECT a.*
	FROM dbo.account a
	INNER JOIN dbo.accountInformation ai ON ai.accountId = a.id
	LEFT JOIN dbo.chatRoomRole crr 
		ON crr.authorizedAccountId = a.id
		AND crr.chatRoomId = @chatRoomId
		AND crr.status = 'normal'
	WHERE 
		a.status = 'normal'
		AND ai.addedById = @addedById
		AND crr.id IS NULL
	ORDER BY
	(
		SELECT STRING_AGG(s.value, ' ') WITHIN GROUP (ORDER BY s.ordinal DESC)
		FROM STRING_SPLIT(LTRIM(RTRIM(a.lastName)), ' ', 1) s
	) COLLATE Vietnamese_100_CI_AI,
	(
		SELECT STRING_AGG(s.value, ' ') WITHIN GROUP (ORDER BY s.ordinal DESC)
		FROM STRING_SPLIT(LTRIM(RTRIM(a.firstName)), ' ', 1) s
	) COLLATE Vietnamese_100_CI_AI,
	a.id ASC
	OFFSET (@page - 1) * @size ROWS
	FETCH NEXT @size ROWS ONLY;

	SELECT COUNT(*) AS totalCount
	FROM dbo.account a
	INNER JOIN dbo.accountInformation ai ON ai.accountId = a.id
	LEFT JOIN dbo.chatRoomRole crr 
		ON crr.authorizedAccountId = a.id
		AND crr.chatRoomId = @chatRoomId
		AND crr.status = 'normal'
	WHERE 
		a.status = 'normal'
		AND ai.addedById = @addedById
		AND crr.id IS NULL;
END
GO 

CREATE PROCEDURE GetAccountReceiveMessage
	@zaloOaId INT,
    @accountId INT
AS
BEGIN
	SELECT * FROM dbo.accountReceiveMessage WHERE accountId = @accountId and zaloOaId = @zaloOaId
END
GO

CREATE PROCEDURE GetMyRecommend
    @accountId INT
AS
BEGIN
	SELECT * FROM dbo.recommend WHERE accountId = @accountId
END
GO

EXEC dbo.GetNotReplyAccounts
    @page = 1,
    @size = 10,
    @chatRoomId = 24,
    @accountId = 1;