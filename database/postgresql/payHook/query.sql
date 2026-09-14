CREATE OR REPLACE FUNCTION get_pay_hooks (
    p_page INT,
    p_size INT,
    p_reference_code VARCHAR DEFAULT NULL,
    p_agent_pay_id UUID DEFAULT NULL,
    p_order_id UUID DEFAULT NULL,
    p_wallet_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    gateway VARCHAR(255),
    transaction_date TIMESTAMP,
    account_number VARCHAR(255),
    sub_account VARCHAR(255),
    code VARCHAR(255),
    content VARCHAR(255),
    transfer_type VARCHAR(255),
    description VARCHAR(255),
    transfer_amount DECIMAL(20,2),
    reference_code VARCHAR(255),
    accumulated DECIMAL(20,2),
    agent_pay_id UUID,
    order_id UUID,
    require_take_money_id UUID,
    wallet_id UUID,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN

    RETURN QUERY
    SELECT
        p.*,
        COUNT(*) OVER () AS total_count
    FROM pay_hook AS p
    WHERE
        (p_reference_code IS NULL OR p.reference_code = p_reference_code)
        AND (p_agent_pay_id IS NULL OR p.agent_pay_id = p_agent_pay_id)
        AND (p_order_id IS NULL OR p.order_id = p_order_id)
        AND (p_wallet_id IS NULL OR p.wallet_id = p_wallet_id)
    ORDER BY p.transaction_date DESC
    OFFSET (p_page - 1) * p_size
    LIMIT p_size;

END;
$$;