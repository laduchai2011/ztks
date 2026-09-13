CREATE TABLE account (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    avatar VARCHAR(255),
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    updateTime TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createTime TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account_information (
    added_by_id UUID,
    account_type VARCHAR(255) NOT NULL,
	account_id UUID NOT NULL UNIQUE,
	
	CONSTRAINT FK_account_information_added_by FOREIGN KEY (added_by_id) REFERENCES account(id),
	CONSTRAINT FK_account_information_account FOREIGN KEY (account_id) REFERENCES account(id),

	CONSTRAINT check_type_account CHECK (account_type IN ('admin', 'member', 'adminZtks', 'memberZtks'))
);
CREATE INDEX idx_account_information_added_by_id ON account_information(added_by_id);

-- CREATE TABLE account_receive_message (
--     account_id_receive_message UUID,
-- 	zalo_oa_id UUID NOT NULL,
-- 	account_id UUID NOT NULL,

-- 	CONSTRAINT FK_accountReceiveMessage_accountIdReceiveMessage FOREIGN KEY (account_id_receive_message) REFERENCES account(id),
-- 	CONSTRAINT UQ_accountReceiveMessage_accountId_zaloOaId UNIQUE (account_id, zalo_oa_id),
-- 	CONSTRAINT FK_accountReceiveMessage_Account FOREIGN KEY (account_id) REFERENCES account(id)
-- );
-- GO
-- CREATE NONCLUSTERED INDEX idx_accountIdReceiveMessage ON accountReceiveMessage(accountIdReceiveMessage);
-- GO

-- CREATE TABLE recommend (
--     myCode VARCHAR(255) NOT NULL UNIQUE,
-- 	yourCode VARCHAR(255),
-- 	accountId INT NOT NULL UNIQUE,

-- 	CONSTRAINT FK_recommend_Account FOREIGN KEY (accountId) REFERENCES account(id)
-- );
-- GO
-- CREATE UNIQUE NONCLUSTERED INDEX idx_recommend_yourCode_unique ON recommend(yourCode) WHERE yourCode IS NOT NULL;
-- GO