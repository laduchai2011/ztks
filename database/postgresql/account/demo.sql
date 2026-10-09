SELECT *
FROM account
WHERE user_name = 'admin1';

SELECT *
FROM signup(
    'member4',
    'member4',
    '0789860859',
    'Member',
    '4'
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