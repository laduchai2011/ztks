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
        'memberZtks1',
        'memberZtks1',
        '0789860855',
        'memberZtks1',
        'memberZtks1',
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
        7,
        'memberZtks',
        8
    );


DELETE FROM dbo.accountInformation
WHERE accountId = 3;
go
DELETE FROM dbo.account
WHERE id = 3;
go