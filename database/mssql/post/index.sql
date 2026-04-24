CREATE TABLE registerPost (
	id INT PRIMARY KEY IDENTITY(1,1),
	name NVARCHAR(255) NOT NULL,
	type VARCHAR(255) NOT NULL,
	expiryTime DATETIMEOFFSET(7),
	isDelete BIT NOT NULL DEFAULT 0,
	zaloOaId INT NOT NULL,
	accountId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_registerPost_ZaloOaId FOREIGN KEY (zaloOaId) REFERENCES zaloOa(id),
	CONSTRAINT FK_registerPost_AccountId FOREIGN KEY (accountId) REFERENCES account(id),

	CONSTRAINT type_registerPost CHECK (type IN ('free', 'upgrade'))
);
GO
CREATE NONCLUSTERED INDEX idx_accountId ON registerPost(accountId);
GO

CREATE TABLE post (
	id INT PRIMARY KEY IDENTITY(1,1),
	name NVARCHAR(255) NOT NULL,
	type VARCHAR(255) NOT NULL,
	title NVARCHAR(255) NOT NULL,
	describe NVARCHAR(MAX) NOT NULL,
	images NVARCHAR(MAX) NOT NULL,
	isActive BIT NOT NULL DEFAULT 0,
	registerPostId INT NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_post_RegisterPostId FOREIGN KEY (registerPostId) REFERENCES registerPost(id),

	CONSTRAINT type_post CHECK (type IN ('free', 'upgrade'))
);
GO
CREATE NONCLUSTERED INDEX idx_registerPostId ON post(registerPostId);
GO