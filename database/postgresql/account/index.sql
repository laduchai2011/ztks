CREATE TABLE account (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    avatar VARCHAR(255),
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    update_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account_information (
    added_by_id UUID,
    account_type VARCHAR(255) NOT NULL,
	account_id UUID NOT NULL UNIQUE,
	
	CONSTRAINT FK_account_information_added_by FOREIGN KEY (added_by_id) REFERENCES account(id),
	CONSTRAINT FK_account_information_account FOREIGN KEY (account_id) REFERENCES account(id)

	CONSTRAINT check_type_account CHECK (account_type IN ('admin', 'member', 'adminZtks', 'memberZtks'))
);
CREATE INDEX idx_account_information_added_by_id ON account_information(added_by_id);

CREATE TABLE account_receive_message (
    account_id_receive_message UUID,
	zalo_oa_id UUID NOT NULL,,
	account_id UUID NOT NULL,

	CONSTRAINT FK_account_receiveMessage_accountId_receive_message FOREIGN KEY (account_id_receive_message) REFERENCES account(id),
	CONSTRAINT UQ_account_receive_message_account_id_zalo_oa_id UNIQUE (account_id, zalo_oa_id),
	CONSTRAINT FK_account_receive_message_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE INDEX idx_account_receive_message_account_id_receive_message ON account_receive_message(account_id_receive_message);

CREATE TABLE recommend (
    my_code VARCHAR(255) NOT NULL UNIQUE,
	your_code VARCHAR(255),
	account_id UUID NOT NULL UNIQUE,

	CONSTRAINT FK_recommend_account FOREIGN KEY (account_id) REFERENCES account(id)
);
CREATE UNIQUE INDEX ux_recommend_your_code ON recommend(your_code) WHERE your_code IS NOT NULL;

CREATE TABLE team (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
	is_lock BOOLEAN NOT NULL DEFAULT FALSE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_team_account_id FOREIGN KEY (account_id) REFERENCES account(id),
    CONSTRAINT type_team
        CHECK (type IN ('sale', 'store'))
);
CREATE INDEX idx_team_account_id ON team(account_id);

CREATE TABLE team_member (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    team_id UUID NOT NULL,
    account_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
	is_lock BOOLEAN NOT NULL DEFAULT FALSE,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_team_member_team FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_member_account FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT team_member_role CHECK (role IN ('leader', 'member')),
    CONSTRAINT ux_team_member UNIQUE (team_id, account_id)
);
CREATE INDEX idx_team_member_account_id ON team(account_id);
CREATE UNIQUE INDEX ux_team_member_one_leader ON team_member (team_id) WHERE role = 'leader' AND is_delete = FALSE;