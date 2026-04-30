ALTER TABLE [order]
ADD isDelete BIT NOT NULL DEFAULT 0;


ALTER TABLE [order]
DROP CONSTRAINT FK_order_ZaloOa,
     CONSTRAINT FK_order_Account;

DROP INDEX idx_zaloOa_id ON [order];
DROP INDEX idx_account_id ON [order];

ALTER TABLE [order]
DROP COLUMN zaloOaId;
ALTER TABLE [order]
DROP COLUMN accountId;
ALTER TABLE [order]
DROP COLUMN status;



ALTER TABLE orderStatus
DROP COLUMN updateTime;