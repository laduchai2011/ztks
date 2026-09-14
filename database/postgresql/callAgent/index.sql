CREATE TABLE call_agent (
   	id UUID PRIMARY KEY DEFAULT uuidv7(),
    agent_code VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    transport VARCHAR(255) NOT NULL DEFAULT 'transport-ws',
    context VARCHAR(255) NOT NULL DEFAULT 'agent-to-zaloUser',
    allow_codec VARCHAR(255) NOT NULL DEFAULT 'opus,ulaw,alaw',
    max_contacts SMALLINT NOT NULL DEFAULT 1,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    account_id UUID NOT NULL UNIQUE,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- CONSTRAINT UQ_callAgent_agentCode UNIQUE(agentCode),
    CONSTRAINT FK_call_agent_account FOREIGN KEY(account_id) REFERENCES account(id)
);
-- CREATE INDEX IX_callAgent_accountId ON callAgent(accountId);
-- GO
-- CREATE INDEX IX_callAgent_isDelete ON callAgent(isDelete);
-- GO

CREATE TABLE zalo_trunk (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    trunk_code VARCHAR(255) NOT NULL UNIQUE,
    transport VARCHAR(255) NOT NULL DEFAULT 'transport-udp',
    context VARCHAR(255) NOT NULL DEFAULT 'userZalo-to-agent',
    allow_codec VARCHAR(255) NOT NULL DEFAULT 'ulaw,alaw',
    domain VARCHAR(255) NOT NULL,
    from_user VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    trust_id_outbound BOOLEAN NOT NULL DEFAULT TRUE,
    send_pai BOOLEAN NOT NULL DEFAULT TRUE,
    send_rpid BOOLEAN NOT NULL DEFAULT TRUE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT ux_zalo_trunk_domain_from_user UNIQUE (domain, from_user),
    CONSTRAINT ux_zalo_trunk_trunk_code UNIQUE(trunk_code),
    CONSTRAINT FK_zalo_trunk_account FOREIGN KEY(account_id) REFERENCES account(id)
);
CREATE INDEX idx_zalo_trunk_account_id ON zalo_trunk(account_id);
-- CREATE NONCLUSTERED INDEX IX_zaloTrunk_isDelete ON zaloTrunk(isDelete);
-- GO

CREATE TABLE call_permit (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    uid VARCHAR(255) NOT NULL UNIQUE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    call_agent_id UUID NOT NULL,
	zalo_trunk_id UUID,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_call_permit_call_Agent FOREIGN KEY(call_agent_id) REFERENCES call_agent(id),
	CONSTRAINT FK_call_permit_zalo_trunk FOREIGN KEY(zalo_trunk_id) REFERENCES zalo_trunk(id)
);
CREATE INDEX idx_call_permit_call_agent_id ON call_permit(call_agent_id);
CREATE INDEX idx_call_permit_zalo_trunk_id ON call_permit(zalo_trunk_id);

CREATE VIEW ps_endpoints
AS
    SELECT
        agent_code AS id,
        'transport-ws' AS transport,
        agent_code AS aors,
        'auth' || agent_code AS auth,
        context AS context,
        'all' AS disallow,
        'opus,ulaw,alaw' AS allow,
        'yes' AS webrtc,
        'dtls' AS media_encryption,
        'yes' AS dtls_auto_generate_cert,
        'yes' AS ice_support,
        'yes' AS rtcp_mux,
        'yes' AS use_avpf,
        'yes' AS rtp_symmetric,
        'yes' AS rewrite_contact,
        'yes' AS force_rport,
        'no' AS direct_media,
        NULL AS from_domain,
        NULL AS from_user,
        NULL AS trust_id_outbound,
        NULL AS send_pai,
        NULL AS send_rpid
    FROM call_agent
    WHERE is_delete = FALSE
    UNION ALL
    SELECT
        trunk_code || '-endpoint',
        transport,
        trunk_code || '-aor',
        NULL,
        context,
        NULL,
        allow_codec,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        domain,
        from_user,
        'yes',
        'yes',
        'yes'
    FROM zalo_trunk
    WHERE is_delete = FALSE;

CREATE VIEW ps_auths
AS
    SELECT
        'auth' || agent_code AS id,
        'userpass' AS auth_type,
        agent_code AS username,
        password
    FROM call_agent
    WHERE is_delete = FALSE;

CREATE VIEW ps_aors
AS
    SELECT
        agent_code AS id,
        NULL AS contact,
        1 AS max_contacts,
        'yes' AS remove_existing
    FROM call_agent
    WHERE is_delete = FALSE
    UNION ALL
    SELECT
        trunk_code || '-aor',
        contact,
        NULL,
        NULL
    FROM zalo_trunk
    WHERE is_delete = FALSE;

CREATE VIEW ps_endpoint_id_ips
AS
    SELECT
        trunk_code || '-identify' AS id,
        trunk_code || '-endpoint' AS endpoint,
        domain AS match
    FROM zalo_trunk
    WHERE is_delete = FALSE;