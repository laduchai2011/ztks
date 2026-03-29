CREATE TABLE payHook (
    id INT PRIMARY KEY,
    gateway varchar(255) NOT NULL,
    transactionDate DATETIME NOT NULL DEFAULT GETDATE(),
    accountNumber varchar(255) DEFAULT NULL,
    subAccount varchar(255) DEFAULT NULL,
	code varchar(255) DEFAULT NULL,
	content varchar(255) DEFAULT NULL,
	transferType varchar(255) DEFAULT NULL,
	description varchar(255) DEFAULT NULL,
	transferAmount decimal(20,2) NOT NULL DEFAULT 0.00,
	referenceCode varchar(255) DEFAULT NULL,
    accumulated decimal(20,2) NOT NULL DEFAULT 0.00,
	agentPayId INT,
	orderId INT,

	CONSTRAINT FK_payHook_AgentPay FOREIGN KEY (agentPayId) REFERENCES agentPay(id),
	CONSTRAINT FK_payHook_Order FOREIGN KEY (orderId) REFERENCES [order](id)
)
GO
CREATE NONCLUSTERED INDEX idx_referenceCode ON payHook(referenceCode);
GO
CREATE NONCLUSTERED INDEX idx_agentPay_id ON payHook(agentPayId);
GO
CREATE NONCLUSTERED INDEX idx_order_id ON payHook(orderId);
GO


