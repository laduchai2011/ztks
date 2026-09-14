SELECT *
FROM account
WHERE user_name = 'admin1';

SELECT *
FROM signup(
    'admin1',
    'admin1',
    '0789860855',
    'Admin',
    '1'
);

EXEC dbo.GetNotReplyAccounts
    @page = 1,
    @size = 10,
    @chatRoomId = 24,
    @accountId = 1;

SELECT
    SERVERPROPERTY('Edition') AS Edition,
    SERVERPROPERTY('ProductVersion') AS ProductVersion,
    SERVERPROPERTY('ProductLevel') AS ProductLevel;

SELECT
    SERVERPROPERTY('Edition') AS Edition,
    SERVERPROPERTY('ProductVersion') AS ProductVersion,
    SERVERPROPERTY('ProductUpdateLevel') AS ProductUpdateLevel;