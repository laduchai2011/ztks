DELETE FROM account WHERE id = 2
GO

EXEC Signup N'member1', N'member1', N'0789860856', N'Member', N'1';

EXEC dbo.GetNotReplyAccounts
    @page = 1,
    @size = 10,
    @chatRoomId = 24,
    @accountId = 1;