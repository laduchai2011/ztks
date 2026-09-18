CREATE OR REPLACE FUNCTION get_all_wallets (
    p_account_id UUID
)
RETURNS SETOF wallet
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM wallet
    WHERE account_id = p_account_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_my_wallet_with_type (
    p_type VARCHAR(8),
    p_account_id UUID
)
RETURNS SETOF wallet
LANGUAGE sql
AS $$
    SELECT *
    FROM wallet
    WHERE account_id = p_account_id
      AND type = p_type;
$$;

CREATE OR REPLACE FUNCTION get_balance_fluctuations (
    p_page INT,
    p_size INT,
    p_wallet_id UUID
)
RETURNS TABLE (
    id UUID,
    amount DECIMAL(20,2),
    type VARCHAR,
    pay_hook_id UUID,
    voucher_id UUID,
    order_id UUID,
    require_take_money_id UUID,
    wallet_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE sql
AS $$
    WITH paged_dates AS (
        SELECT DISTINCT
            (create_time AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE AS create_date
        FROM balance_fluctuation
        WHERE wallet_id = p_wallet_id
        ORDER BY create_date DESC
        OFFSET (p_page - 1) * p_size
        LIMIT p_size
    )
    SELECT
        bf.id,
        bf.amount,
        bf.type,
        bf.pay_hook_id,
        bf.voucher_id,
        bf.order_id,
        bf.require_take_money_id,
        bf.wallet_id,
        bf.create_time
    FROM balance_fluctuation bf
    JOIN paged_dates d
        ON (bf.create_time AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE = d.create_date
    WHERE bf.wallet_id = p_wallet_id
    ORDER BY bf.create_time DESC;
$$;

-- DROP FUNCTION IF EXISTS member_get_require_take_money_of_wallet(UUID, UUID);
CREATE OR REPLACE FUNCTION member_get_require_take_money_of_wallet (
    p_wallet_id UUID,
    p_account_id UUID
)
RETURNS SETOF require_take_money
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT r.*
    FROM require_take_money AS r
    WHERE r.wallet_id = p_wallet_id
      AND r.account_id = p_account_id
      AND r.is_delete = FALSE
      AND r.is_do = FALSE
    ORDER BY r.create_time DESC;
END;
$$;

-- DROP FUNCTION IF EXISTS member_ztks_get_requires_take_money(
--     INT,
--     INT,
--     UUID,
--     BOOLEAN,
--     DECIMAL,
--     DECIMAL,
--     TIMESTAMP,
--     TIMESTAMP,
--     TIMESTAMP,
--     TIMESTAMP
-- );
CREATE OR REPLACE FUNCTION member_ztks_get_requires_take_money (
    p_page INT,
    p_size INT,
    p_member_ztks_id UUID DEFAULT NULL,
    p_is_do BOOLEAN DEFAULT NULL,
    p_money_from DECIMAL(20,2) DEFAULT NULL,
    p_money_to DECIMAL(20,2) DEFAULT NULL,
    p_do_from_date TIMESTAMP DEFAULT NULL,
    p_do_to_date TIMESTAMP DEFAULT NULL,
    p_from_date TIMESTAMP DEFAULT NULL,
    p_to_date TIMESTAMP DEFAULT NULL
)
RETURNS TABLE (
    items JSONB,
    total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN

    RETURN QUERY
    WITH filtered AS (
        SELECT
            rtm.*,
            ROW_NUMBER() OVER (ORDER BY rtm.id ASC) AS rn
        FROM require_take_money AS rtm
        WHERE
            rtm.is_delete = FALSE

            AND (
                (
                    p_member_ztks_id IS NULL
                    AND rtm.member_ztks_id IS NULL
                )
                OR rtm.member_ztks_id = p_member_ztks_id
            )

            AND (
                p_is_do IS NULL
                OR rtm.is_do = p_is_do
            )

            AND (
                p_money_from IS NULL
                OR rtm.amount >= p_money_from
            )

            AND (
                p_money_to IS NULL
                OR rtm.amount <= p_money_to
            )

            AND (
                p_do_from_date IS NULL
                OR rtm.do_time >= p_do_from_date
            )

            AND (
                p_do_to_date IS NULL
                OR rtm.do_time < p_do_to_date
            )

            AND (
                p_from_date IS NULL
                OR rtm.create_time >= p_from_date
            )

            AND (
                p_to_date IS NULL
                OR rtm.create_time < p_to_date
            )
    ),

    paged AS (
        SELECT *
        FROM filtered
        WHERE rn BETWEEN
            ((p_page - 1) * p_size + 1)
            AND (p_page * p_size)
    )

    SELECT
        COALESCE(
            (
                SELECT jsonb_agg(
                    to_jsonb(paged) - 'rn'
                    ORDER BY paged.rn
                )
                FROM paged
            ),
            '[]'::jsonb
        ) AS items,

        (
            SELECT COUNT(*)
            FROM filtered
        ) AS total_count;

END;
$$;

CREATE OR REPLACE FUNCTION get_require_with_id (
    p_id UUID
)
RETURNS SETOF require_take_money
LANGUAGE sql
AS $$
    SELECT *
    FROM require_take_money
    WHERE id = p_id;
$$;