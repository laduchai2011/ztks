ALTER TABLE note
ADD isDelete BIT NOT NULL DEFAULT 0;


ALTER TABLE note
DROP CONSTRAINT FK_note_ZaloOa,
     CONSTRAINT FK_note_Account;

DROP INDEX idx_zaloOa_id ON note;
DROP INDEX idx_account_id ON note;

ALTER TABLE note
DROP COLUMN zaloOaId;
ALTER TABLE note
DROP COLUMN accountId;
ALTER TABLE note
DROP COLUMN status;



ALTER TABLE orderStatus
DROP COLUMN updateTime;