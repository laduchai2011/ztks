CREATE OR REPLACE FUNCTION create_pay_hook (
    p_id UUID,
    p_gateway VARCHAR(255),
    p_transaction_date TIMESTAMP,
    p_account_number VARCHAR(255),
    p_sub_account VARCHAR(255),
    p_code VARCHAR(255),
    p_content VARCHAR(255),
    p_transfer_type VARCHAR(255),
    p_description VARCHAR(255),
    p_transfer_amount DECIMAL(20,2),
    p_reference_code VARCHAR(255),
    p_accumulated DECIMAL(20,2),
    p_agent_pay_id UUID,
    p_order_id UUID,
    p_require_take_money_id UUID,
    p_wallet_id UUID
)
RETURNS SETOF pay_hook
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO pay_hook (
        id,
        gateway,
        transaction_date,
        account_number,
        sub_account,
        code,
        content,
        transfer_type,
        description,
        transfer_amount,
        reference_code,
        accumulated,
        agent_pay_id,
        order_id,
        require_take_money_id,
        wallet_id
    )
    VALUES (
        p_id,
        p_gateway,
        p_transaction_date,
        p_account_number,
        p_sub_account,
        p_code,
        p_content,
        p_transfer_type,
        p_description,
        p_transfer_amount,
        p_reference_code,
        p_accumulated,
        p_agent_pay_id,
        p_order_id,
        p_require_take_money_id,
        p_wallet_id
    );

    RETURN QUERY
    SELECT *
    FROM pay_hook
    WHERE id = p_id;

END;
$$;