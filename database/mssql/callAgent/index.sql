-- CREATE TABLE callAgent (
--     id INT PRIMARY KEY IDENTITY(1,1),
-- 	agentCode NVARCHAR(255) NOT NULL UNIQUE,
--     password NVARCHAR(255) NOT NULL,
-- 	uid NVARCHAR(255),
-- 	isDelete BIT NOT NULL DEFAULT 0,
-- 	accountId INT NOT NULL,
--     createTime DATETIMEOFFSET(7) NOT NULL,

--     CONSTRAINT UQ_callAgent_zaloOaId_userIdByApp UNIQUE (zaloOaId, userIdByApp),
-- 	CONSTRAINT FK_callAgent_Account FOREIGN KEY (accountId) REFERENCES account(id)
-- )
-- GO
-- CREATE NONCLUSTERED INDEX idx_account_id ON bank(accountId);
-- GO

-- CREATE TABLE ps_endpoints (
--     id INT PRIMARY KEY IDENTITY(1,1),

--     transport NVARCHAR(255),
--     aors NVARCHAR(255),
--     auth NVARCHAR(255),

--     context NVARCHAR(255),

--     disallow NVARCHAR(255),
--     allow NVARCHAR(255),

--     webrtc NVARCHAR(255),

--     media_encryption NVARCHAR(255),
--     dtls_auto_generate_cert NVARCHAR(255),

--     ice_support NVARCHAR(255),
--     rtcp_mux NVARCHAR(255),
--     use_avpf NVARCHAR(255),

--     rtp_symmetric NVARCHAR(255),
--     rewrite_contact NVARCHAR(255),
--     force_rport NVARCHAR(255),

--     direct_media NVARCHAR(255),

--     from_domain NVARCHAR(255),
--     from_user NVARCHAR(255),

--     trust_id_outbound NVARCHAR(255),
--     send_pai NVARCHAR(255),
--     send_rpid NVARCHAR(255),

-- 	callAgentId INT NOT NULL,

-- 	CONSTRAINT FK_ps_endpoints_CallAgent FOREIGN KEY (callAgentId) REFERENCES callAgent(id)
-- );


-- CREATE TABLE ps_auths (
--     id nvarchar(80) PRIMARY KEY,
--     auth_type NVARCHAR(255),
--     username NVARCHAR(255),
--     password NVARCHAR(255),

-- 	callAgentId INT NOT NULL,

-- 	CONSTRAINT FK_ps_endpoints_CallAgent FOREIGN KEY (callAgentId) REFERENCES callAgent(id)
-- );

-- CREATE TABLE ps_aors (
--     id INT PRIMARY KEY IDENTITY(1,1),
--     max_contacts INT,
--     remove_existing NVARCHAR(255),
--     contact NVARCHAR(255),

-- 	callAgentId INT NOT NULL,

-- 	CONSTRAINT FK_ps_endpoints_CallAgent FOREIGN KEY (callAgentId) REFERENCES callAgent(id)
-- );

-- -- CREATE TABLE ps_endpoint_id_ips (
-- --     id nvarchar(80) PRIMARY KEY,
-- --     endpoint nvarchar(80),
-- --     match nvarchar(200),

-- -- 	callAgentId INT NOT NULL,

-- -- 	CONSTRAINT FK_ps_endpoints_CallAgent FOREIGN KEY (callAgentId) REFERENCES callAgent(id)
-- -- );


CREATE TABLE callAgent
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    agentCode NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    transport NVARCHAR(255) NOT NULL DEFAULT 'transport-ws',
    context NVARCHAR(255) NOT NULL DEFAULT 'agent-to-zaloUser',
    allowCodec NVARCHAR(255) NOT NULL DEFAULT 'opus,ulaw,alaw',
    maxContacts INT NOT NULL DEFAULT 1,
    isDelete BIT NOT NULL DEFAULT 0,
    accountId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),

    CONSTRAINT UQ_callAgent_agentCode UNIQUE(agentCode),
    CONSTRAINT FK_callAgent_Account FOREIGN KEY(accountId) REFERENCES account(id)
);
GO
CREATE INDEX IX_callAgent_accountId ON callAgent(accountId);
GO
CREATE INDEX IX_callAgent_isDelete ON callAgent(isDelete);
GO

CREATE TABLE callPermit
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    uid NVARCHAR(255) NOT NULL UNIQUE,
    isDelete BIT NOT NULL DEFAULT 0,
    callAgentId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),

    CONSTRAINT FK_callPermittance_CallAgent FOREIGN KEY(callAgentId) REFERENCES callAgent(id)
)
GO
CREATE INDEX IX_callPermit_callAgentId ON callPermit(callAgentId);
GO

CREATE TABLE zaloTrunk
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    trunkCode NVARCHAR(255) NOT NULL,
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
CREATE INDEX IX_zaloTrunk_accountId ON zaloTrunk(accountId);
GO
CREATE INDEX IX_zaloTrunk_isDelete ON zaloTrunk(isDelete);
GO

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

CREATE VIEW ps_auths
AS
    SELECT
        'auth'+agentCode AS id,
        'userpass' AS auth_type,
        agentCode AS username,
        password
    FROM callAgent
    WHERE isDelete=0;

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

CREATE VIEW ps_endpoint_id_ips
AS
    SELECT
        trunkCode+'-identify' AS id,
        trunkCode+'-endpoint' AS endpoint,
        domain AS match
    FROM zaloTrunk
    WHERE isDelete=0;