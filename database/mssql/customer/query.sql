ALTER FUNCTION SigninCustomer (@phone NVARCHAR(255), @password NVARCHAR(255)) RETURNS TABLE AS RETURN (
    SELECT * FROM dbo.customer WHERE phone = @phone AND password = @password
);
GO

CREATE PROCEDURE CustomerGetMe
    @id INT
AS
BEGIN
	SELECT *
	FROM dbo.customer
	WHERE id = @id
END
GO