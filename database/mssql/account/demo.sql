DELETE FROM account WHERE id = 2
GO

EXEC Signup N'admin1', N'admin1', N'0789860855', N'Admin', N'1';

EXEC dbo.GetNotReplyAccounts
    @page = 1,
    @size = 10,
    @chatRoomId = 24,
    @accountId = 1;