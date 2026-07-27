CREATE TABLE callAgent
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    agentCode NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    transport NVARCHAR(255) NOT NULL DEFAULT 'transport-ws',
    context NVARCHAR(255) NOT NULL DEFAULT 'agent-to-zaloUser',
    allowCodec NVARCHAR(255) NOT NULL DEFAULT 'opus,ulaw,alaw',
    maxContacts INT NOT NULL DEFAULT 1,
    isDelete BIT NOT NULL DEFAULT 0,
    accountId INT NOT NULL UNIQUE,
    createTime DATETIMEOFFSET(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),

    -- CONSTRAINT UQ_callAgent_agentCode UNIQUE(agentCode),
    CONSTRAINT FK_callAgent_Account FOREIGN KEY(accountId) REFERENCES account(id)
);
GO
-- CREATE INDEX IX_callAgent_accountId ON callAgent(accountId);
-- GO
-- CREATE INDEX IX_callAgent_isDelete ON callAgent(isDelete);
-- GO

CREATE TABLE callPermit
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    uid NVARCHAR(255) NOT NULL UNIQUE,
    isDelete BIT NOT NULL DEFAULT 0,
    callAgentId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),

    CONSTRAINT FK_callPermit_CallAgent FOREIGN KEY(callAgentId) REFERENCES callAgent(id)
)
GO
CREATE NONCLUSTERED INDEX IX_callPermit_callAgentId ON callPermit(callAgentId);
GO

CREATE TABLE zaloTrunk
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    trunkCode NVARCHAR(255) NOT NULL UNIQUE,
    transport NVARCHAR(255) NOT NULL DEFAULT 'transport-udp',
    context NVARCHAR(255) NOT NULL DEFAULT 'userZalo-to-agent',
    allowCodec NVARCHAR(255) NOT NULL DEFAULT 'ulaw,alaw',
    domain NVARCHAR(255) NOT NULL,
    fromUser NVARCHAR(255) NOT NULL,
    contact NVARCHAR(255) NOT NULL,
    trustIdOutbound BIT NOT NULL DEFAULT 1,
    sendPai BIT NOT NULL DEFAULT 1,
    sendRpid BIT NOT NULL DEFAULT 1,
    isDelete BIT NOT NULL DEFAULT 0,
    accountId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),

    CONSTRAINT UQ_zaloTrunk_trunkCode UNIQUE(trunkCode),
    CONSTRAINT FK_zaloTrunk_Account FOREIGN KEY(accountId) REFERENCES account(id)
);
GO
CREATE NONCLUSTERED INDEX IX_zaloTrunk_accountId ON zaloTrunk(accountId);
GO
-- CREATE NONCLUSTERED INDEX IX_zaloTrunk_isDelete ON zaloTrunk(isDelete);
-- GO

CREATE VIEW ps_endpoints
AS
    SELECT
        agentCode AS id,
        'transport-ws' AS transport,
        agentCode AS aors,
        'auth' + agentCode AS auth,
        'internal' AS context,
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
    FROM callAgent
    WHERE isDelete=0
    UNION ALL
    SELECT
        trunkCode + '-endpoint',
        transport,
        trunkCode + '-aor',
        NULL,
        context,
        NULL,
        allowCodec,
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
        fromUser,
        'yes',
        'yes',
        'yes'
    FROM zaloTrunk
    WHERE isDelete=0;
GO

CREATE VIEW ps_auths
AS
    SELECT
        'auth'+agentCode AS id,
        'userpass' AS auth_type,
        agentCode AS username,
        password
    FROM callAgent
    WHERE isDelete=0;
GO

CREATE VIEW ps_aors
AS
    SELECT
        agentCode AS id,
        NULL AS contact,
        1 AS max_contacts,
        'no' AS remove_existing
    FROM callAgent
    WHERE isDelete=0
    UNION ALL
    SELECT
        trunkCode+'-aor',
        contact,
        NULL,
        NULL
    FROM zaloTrunk
    WHERE isDelete=0;
GO

CREATE VIEW ps_endpoint_id_ips
AS
    SELECT
        trunkCode+'-identify' AS id,
        trunkCode+'-endpoint' AS endpoint,
        domain AS match
    FROM zaloTrunk
    WHERE isDelete=0;
GO