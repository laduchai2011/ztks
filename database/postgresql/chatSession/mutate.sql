CREATE OR REPLACE FUNCTION create_chat_session (
    p_label VARCHAR(255),
    p_code VARCHAR(255),
    p_is_ready BOOLEAN,
    p_selected_account_id UUID,
    p_zalo_oa_id UUID,
    p_account_id UUID
)
RETURNS SETOF chat_session
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_chat_session_id UUID;
BEGIN
    -- Kiểm tra quyền admin
    IF NOT EXISTS (
        SELECT 1
        FROM account_information
        WHERE added_by_id = p_account_id
          AND account_id = p_selected_account_id
    ) THEN
        RAISE EXCEPTION 'Bạn không phải admin của tài khoản này.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Tạo chatSession
    INSERT INTO chat_session (
        label,
        code,
        is_ready,
        status,
        selected_account_id,
        zalo_oa_id,
        account_id,
        update_time,
        create_time
    )
    VALUES (
        p_label,
        p_code,
        p_is_ready,
        'normal',
        p_selected_account_id,
        p_zalo_oa_id,
        p_account_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_new_chat_session_id;

    -- Trả về record vừa tạo
    RETURN QUERY
    SELECT *
    FROM chat_session
    WHERE id = v_new_chat_session_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

CREATE OR REPLACE FUNCTION update_selected_account_id_of_chat_session (
    p_id UUID,
    p_selected_account_id UUID,
    p_account_id UUID
)
RETURNS SETOF chatSession
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra account được chọn có thuộc tài khoản
    -- mà p_account_id là admin hay không
    IF NOT EXISTS (
        SELECT 1
        FROM accountInformation
        WHERE addedById = p_account_id
          AND accountId = p_selected_account_id
    ) THEN
        RAISE EXCEPTION 'Bạn không phải admin của tài khoản này.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Update
    UPDATE chatSession
    SET selectedAccountId = p_selected_account_id
    WHERE status = 'normal'
      AND id = p_id
      AND accountId = p_account_id;

    -- Tương đương @@ROWCOUNT = 0
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cập nhật chatSession không thành công.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Trả về chatSession sau khi update
    RETURN QUERY
    SELECT *
    FROM chatSession
    WHERE id = p_id;
END;
$$;

CREATE PROCEDURE UpdateIsReadyOfChatSession
	@id INT,
	@isReady BIT,
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		UPDATE dbo.chatSession
		SET isReady = @isReady
		WHERE status = 'normal' AND id = @id AND accountId = @accountId;
		IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Cập nhật chatSession không thành công.', 1;
        END

		SELECT * FROM dbo.chatSession WHERE id = @id;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

CREATE PROCEDURE LeaveAllChatSession
	@accountId INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @myAdminId INT;

		SELECT @myAdminId = addedById FROM dbo.accountInformation WHERE accountId = @accountId
		IF @myAdminId IS NULL THROW 50001, N'Không tồn tại 1 admin nào cho bạn .', 1;

		UPDATE dbo.chatSession
		SET selectedAccountId = @myAdminId
		WHERE status = 'normal' AND selectedAccountId = @accountId;

		IF NOT EXISTS ( SELECT 1 FROM dbo.chatSession WHERE selectedAccountId = @accountId )
		BEGIN
			SELECT CAST(1 AS BIT) AS success;
		END

		SELECT CAST(0 AS BIT) AS success;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END;
GO

