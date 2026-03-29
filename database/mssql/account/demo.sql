INSERT INTO
    account (
        userName,
        password,
        phone,
        firstName,
        lastName,
        avatar,
        status,
        updateTime,
        createTime
    )
VALUES
    (
        'admin',
        'admin',
        '1234567890',
        'admin',
        'admin',
        NULL,
        'normal',
        TODATETIMEOFFSET(SYSUTCDATETIME(), -5),
        TODATETIMEOFFSET(SYSUTCDATETIME(), -5)
    );


INSERT INTO
    accountInformation (
        addedById,
        accountType,
        accountId
    )
VALUES
    (
        1,
        'admin',
        1
    );


DELETE FROM dbo.accountInformation
WHERE accountId = 3;
go
DELETE FROM dbo.account
WHERE id = 3;
go