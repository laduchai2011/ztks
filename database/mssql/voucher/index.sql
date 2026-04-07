CREATE TABLE voucher (
	id INT PRIMARY KEY IDENTITY(1,1),
	isUsed BIT NOT NULL,
	timeExpire DATETIMEOFFSET(7) NOT NULL,
	money BIGINT,
	orderId INT, 
	memberZtksId INT NOT NULL,
	phone NVARCHAR(255) NOT NULL,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL,

	CONSTRAINT FK_voucher_Order FOREIGN KEY (orderId) REFERENCES [order](id),
	CONSTRAINT FK_voucher_MemberZtksId FOREIGN KEY (memberZtksId) REFERENCES account(id)
);
GO
CREATE NONCLUSTERED INDEX idx_phone ON voucher(phone);
GO
CREATE UNIQUE NONCLUSTERED INDEX idx_voucher_orderId_unique ON voucher(orderId) WHERE orderId IS NOT NULL;
GO