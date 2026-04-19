CREATE TABLE bank (
    id INT PRIMARY KEY IDENTITY(1,1),
	bankCode VARCHAR(255) NOT NULL,
	accountNumber VARCHAR(255) NOT NULL,
	accountName VARCHAR(255) NOT NULL,
    accountId INT NOT NULL, 
	isDelete BIT NOT NULL DEFAULT 0,
    updateTime DATETIMEOFFSET(7) NOT NULL,
    createTime DATETIMEOFFSET(7) NOT NULL

	CONSTRAINT FK_bank_Account FOREIGN KEY (accountId) REFERENCES account(id)
)
GO
CREATE NONCLUSTERED INDEX idx_account_id ON bank(accountId);
GO
