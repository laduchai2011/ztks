-- DROP FUNCTION create_order_v1(VARCHAR,TEXT,DECIMAL,VARCHAR,JSONB,UUID)
-- CREATE OR REPLACE FUNCTION create_order_v1 (
--     p_title VARCHAR(255),
--     p_content TEXT,
--     p_money DECIMAL(20,2),
--     p_phone VARCHAR(255),
--     p_products JSONB,
--     p_account_id UUID
-- )
-- RETURNS SETOF order_v1
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_admin_account_id UUID;
--     v_order_id UUID;
--     v_product RECORD;
--     v_current_quantity INTEGER;
-- BEGIN

--     /*
--      * 1. Tìm account admin
--      */
--     SELECT COALESCE(added_by_id, account_id)
--     INTO v_admin_account_id
--     FROM account_information
--     WHERE account_id = p_account_id;


--     /*
--      * 2. Kiểm tra account admin tồn tại
--      */
--     IF v_admin_account_id IS NULL THEN
--         RAISE EXCEPTION
--             'Admin account not found for account: %',
--             p_account_id;
--     END IF;


--     /*
--      * 3. Kiểm tra người tạo thuộc team sale
--      */
--     IF NOT EXISTS (
--         SELECT 1
--         FROM team_member tm
--         INNER JOIN team t
--             ON t.id = tm.team_id
--         WHERE tm.account_id = p_account_id
--           AND t.type = 'sale'
--           AND t.is_delete = FALSE
--     ) THEN
--         RAISE EXCEPTION
--             'Account % does not belong to a sale team',
--             p_account_id;
--     END IF;


--     /*
--      * 4. Tạo order
--      */
--     INSERT INTO order_v1 (
--         title,
--         content,
--         money,
--         phone,
--         status,
--         process,
--         is_pay,
--         is_delete,
--         account_id
--     )
--     VALUES (
--         p_title,
--         p_content,
--         p_money,
--         p_phone,
--         'created',
--         jsonb_build_array(
--             jsonb_build_object(
--                 'status', 'created',
--                 'timestamp', CURRENT_TIMESTAMP,
--                 'account_id', p_account_id
--             )
--         ),
--         FALSE,
--         FALSE,
--         p_account_id
--     )
--     RETURNING id
--     INTO v_order_id;


--     /*
--      * 5. Duyệt danh sách sản phẩm
--      */
--     FOR v_product IN
--         SELECT
--             product_id,
--             quantity
--         FROM jsonb_to_recordset(p_products) AS x(
--             product_id UUID,
--             quantity INTEGER
--         )
--     LOOP

--         /*
--          * 6. Validate quantity
--          */
--         IF v_product.quantity <= 0 THEN
--             RAISE EXCEPTION
--                 'Product quantity must be greater than 0: %',
--                 v_product.product_id;
--         END IF;


--         /*
--          * 7. Lock product của admin
--          */
--         SELECT
--             quantity_in - quantity_out
--         INTO v_current_quantity
--         FROM product
--         WHERE id = v_product.product_id
--           AND account_id = v_admin_account_id
-- 		  AND is_lock = FALSE
--           AND is_delete = FALSE
--         FOR UPDATE;


--         /*
--          * 8. Kiểm tra product
--          */
--         IF NOT FOUND THEN
--             RAISE EXCEPTION
--                 'Product not found: %',
--                 v_product.product_id;
--         END IF;


--         /*
--          * 9. Kiểm tra tồn kho
--          */
--         IF v_current_quantity < v_product.quantity THEN
--             RAISE EXCEPTION
--                 'Not enough quantity for product %. Available: %, requested: %',
--                 v_product.product_id,
--                 v_current_quantity,
--                 v_product.quantity;
--         END IF;


--         /*
--          * 10. Cập nhật quantity_out
--          */
--         UPDATE product
--         SET quantity_out = quantity_out + v_product.quantity
--         WHERE id = v_product.product_id
--           AND account_id = v_admin_account_id
-- 		  AND is_lock = FALSE
--           AND is_delete = FALSE;


--         /*
--          * 11. Tạo product fluctuation
--          */
--         INSERT INTO product_fluctuation (
--             type,
--             command,
--             quantity,
--             actual_quantity,
--             note,
--             is_finish,
--             is_delete,
--             order_v1_id,
--             product_id,
--             account_id
--         )
--         VALUES (
--             'out',
--             'order',
--             v_product.quantity,
--             v_product.quantity,
--             'Xuất kho theo đơn hàng',
--             FALSE,
--             FALSE,
--             v_order_id,
--             v_product.product_id,
--             p_account_id
--         );

--     END LOOP;


--     /*
--      * 12. Trả order
--      */
--     RETURN QUERY
--     SELECT *
--     FROM order_v1
--     WHERE id = v_order_id;

-- END;
-- $$;

CREATE OR REPLACE FUNCTION create_order_v1 (
    p_title VARCHAR(255),
    p_content TEXT,
    p_idempotency_key VARCHAR(255),
    p_type VARCHAR(255),
    p_sales_team_id UUID,
    p_created_account_id UUID,
    p_admin_account_id UUID,
	p_is_pay BOOLEAN DEFAULT FALSE,
    p_money DECIMAL(20,2) DEFAULT 0.00,
    p_images TEXT[] DEFAULT '{}',
    p_videos TEXT[] DEFAULT '{}',
    p_customer_v1_id UUID DEFAULT NULL,
    p_received_account_id UUID DEFAULT NULL
)
RETURNS SETOF order_v1
LANGUAGE plpgsql
AS $$
BEGIN
	IF NOT EXISTS (
        SELECT 1
        FROM team t
        INNER JOIN team_member tm
            ON tm.team_id = t.id
        WHERE t.id = p_sales_team_id
          AND t.account_id = p_admin_account_id
          AND t.type = 'sales'
          AND t.is_lock = FALSE
          AND t.is_delete = FALSE
          AND tm.account_id = p_created_account_id
    ) THEN
        RAISE EXCEPTION
            'Người tạo đơn không thuộc team sales hợp lệ của admin';
    END IF;
	
    RETURN QUERY
    INSERT INTO order_v1 (
        title,
        content,
        images,
        videos,
        money,
        idempotency_key,
        type,
        sales_team_id,
        customer_v1_id,
        created_account_id,
        received_account_id,
        admin_account_id,
        is_pay
    )
    VALUES (
        p_title,
        p_content,
        p_images,
        p_videos,
        p_money,
        p_idempotency_key,
        p_type,
        p_sales_team_id,
        p_customer_v1_id,
        p_created_account_id,
        p_received_account_id,
        p_admin_account_id,
        p_is_pay
    )
    RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION create_re_order_v1(
    p_root_order_v1 UUID,
    p_account_id UUID
)
RETURNS re_order_v1
LANGUAGE plpgsql
AS $$
DECLARE
    v_order order_v1;
    v_re_order re_order_v1;
BEGIN
    -- Lấy order và đồng thời kiểm tra account sở hữu order
    SELECT *
    INTO v_order
    FROM order_v1
    WHERE id = p_root_order_v1
      AND account_id = p_account_id
      AND is_delete = FALSE;

    -- Không tìm thấy order thuộc account này
    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Order % không tồn tại hoặc account % không phải chủ sở hữu',
            p_root_order_v1,
            p_account_id
        USING ERRCODE = 'P0001';
    END IF;

    -- Tạo re_order từ order gốc
    INSERT INTO re_order_v1 (
        title,
        content,
        money,
        phone,
        status,
        process,
        is_pay,
        is_delete,
        root_order_v1,
        account_id
    )
    VALUES (
        v_order.title,
        v_order.content,
        v_order.money,
        v_order.phone,
        'created',
        jsonb_build_array(
            jsonb_build_object(
                'status', 'created',
                'timestamp', CURRENT_TIMESTAMP,
                'account_id', p_account_id
            )
        ),
        FALSE,
        FALSE,
        v_order.id,
        p_account_id
    )
    RETURNING *
    INTO v_re_order;

    RETURN v_re_order;
END;
$$;

CREATE OR REPLACE FUNCTION finish_order_v1 (
    p_order_v1_id UUID,
    p_account_id UUID
)
RETURNS SETOF order_v1
LANGUAGE plpgsql
AS $$
DECLARE
    v_is_pay BOOLEAN;
    v_status VARCHAR(50);
    v_order_account_id UUID;

    v_order_admin_id UUID;
    v_finish_admin_id UUID;
BEGIN

    -- 1. Kiểm tra order và khóa bản ghi
    SELECT
        o.is_pay,
        o.status,
        o.account_id
    INTO
        v_is_pay,
        v_status,
        v_order_account_id
    FROM order_v1 o
    WHERE o.id = p_order_v1_id
      AND o.is_delete = FALSE
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy order';
    END IF;


    -- 2. Người hoàn thành phải thuộc team store
    IF NOT EXISTS (
        SELECT 1
        FROM team t
        INNER JOIN team_member tm
            ON tm.team_id = t.id
        WHERE t.type = 'store'
          AND t.is_delete = FALSE
          AND tm.is_delete = FALSE
          AND tm.account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Account không thuộc team store';
    END IF;


    -- 3. Lấy admin của người tạo đơn
    SELECT ai.added_by_id
    INTO v_order_admin_id
    FROM account_information ai
    WHERE ai.account_id = v_order_account_id;


    -- 4. Lấy admin của người hoàn thành đơn
    SELECT ai.added_by_id
    INTO v_finish_admin_id
    FROM account_information ai
    WHERE ai.account_id = p_account_id;


    -- 5. Hai account phải có cùng admin
	IF v_order_admin_id IS NULL THEN
	    RAISE EXCEPTION
	        'Người tạo đơn chưa được gán admin';
	END IF;
	IF v_finish_admin_id IS NULL THEN
	    RAISE EXCEPTION
	        'Người hoàn thành đơn chưa được gán admin';
	END IF;
	IF v_order_admin_id <> v_finish_admin_id THEN
	    RAISE EXCEPTION
	        'Người tạo đơn và người hoàn thành đơn không cùng admin';
	END IF;


    -- 6. Order phải được thanh toán
    IF v_is_pay = FALSE THEN
        RAISE EXCEPTION 'Đơn hàng chưa thanh toán';
    END IF;


    -- 7. Order phải đang ở trạng thái paid
    IF v_status <> 'paid' THEN
        RAISE EXCEPTION
            'Không thể hoàn tất order từ trạng thái: %',
            v_status;
    END IF;


    -- 8. Hoàn tất product fluctuation
    UPDATE product_fluctuation
    SET
        is_finish = TRUE,
        finish_time = CURRENT_TIMESTAMP
    WHERE order_v1_id = p_order_v1_id
      AND is_delete = FALSE
      AND is_finish = FALSE;


    -- 9. Cập nhật trạng thái + lịch sử
    UPDATE order_v1
    SET
        status = 'waiting_shipping',
        process = process || jsonb_build_array(
            jsonb_build_object(
                'status', 'waiting_shipping',
                'timestamp', CURRENT_TIMESTAMP,
                'account_id', p_account_id
            )
        )
    WHERE id = p_order_v1_id
      AND is_delete = FALSE;


    -- 10. Trả order
    RETURN QUERY
    SELECT o.*
    FROM order_v1 o
    WHERE o.id = p_order_v1_id;

END;
$$;


CREATE OR REPLACE FUNCTION create_order_v1_inventory_reservation (
    p_order_v1_id UUID,
    p_product_id UUID,
    p_quantity INTEGER
)
RETURNS SETOF order_v1_inventory_reservation
LANGUAGE plpgsql
AS $$
DECLARE
    v_order order_v1%ROWTYPE;
    v_product product%ROWTYPE;
    -- v_reserved_quantity BIGINT;
    v_available_quantity BIGINT;
BEGIN
    -- 1. Kiểm tra tham số đầu vào
    IF p_order_v1_id IS NULL THEN
        RAISE EXCEPTION 'order_v1_id must not be null';
    END IF;

    IF p_product_id IS NULL THEN
        RAISE EXCEPTION 'product_id must not be null';
    END IF;

    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        RAISE EXCEPTION 'quantity must be greater than 0';
    END IF;

    -- 2. Lấy và khóa đơn hàng
    SELECT o.*
    INTO v_order
    FROM order_v1 o
    WHERE o.id = p_order_v1_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order does not exist: %', p_order_v1_id;
    END IF;

    IF v_order.is_delete THEN
        RAISE EXCEPTION 'Order has been deleted: %', p_order_v1_id;
    END IF;

    IF v_order.status IS DISTINCT FROM 'creating' THEN
        RAISE EXCEPTION
            'Order status must be creating. Current status: %',
            v_order.status;
    END IF;

    IF v_order.sales_team_id IS NULL
       OR v_order.created_account_id IS NULL
       OR v_order.admin_account_id IS NULL THEN
        RAISE EXCEPTION
            'Order must have sales_team_id, created_account_id and admin_account_id';
    END IF;

    -- 3. Kiểm tra tài khoản người tạo đơn
    IF NOT EXISTS (
        SELECT 1
        FROM account a
        WHERE a.id = v_order.created_account_id
          AND a.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION
            'Order creator does not exist or has been deleted';
    END IF;

    -- 4. Kiểm tra team của đơn hàng
    IF NOT EXISTS (
        SELECT 1
        FROM team t
        WHERE t.id = v_order.sales_team_id
          AND t.account_id = v_order.admin_account_id
          AND t.type = 'sales'
          AND t.is_lock = FALSE
          AND t.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION
            'Order team is invalid, locked, deleted, or does not belong to the admin';
    END IF;

    -- 5. Người tạo đơn phải là thành viên đang hoạt động của team
    IF NOT EXISTS (
        SELECT 1
        FROM team_member tm
        WHERE tm.team_id = v_order.sales_team_id
          AND tm.account_id = v_order.created_account_id
          AND tm.is_lock = FALSE
          AND tm.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION
            'Order creator is not an active member of team %',
            v_order.sales_team_id;
    END IF;

    -- 6. Lấy và khóa sản phẩm
    SELECT p.*
    INTO v_product
    FROM product p
    WHERE p.id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product does not exist: %', p_product_id;
    END IF;

    IF v_product.is_delete THEN
        RAISE EXCEPTION 'Product has been deleted: %', p_product_id;
    END IF;

    IF v_product.is_lock THEN
        RAISE EXCEPTION 'Product is locked: %', p_product_id;
    END IF;

    -- 7. Kiểm tra quyền của team trên shop, depot và store
    -- chứa sản phẩm
    IF NOT EXISTS (
        SELECT 1
        FROM store s
        JOIN depot d
          ON d.id = s.depot_id
        JOIN shop sh
          ON sh.id = d.shop_id

        JOIN team_shop ts
          ON ts.shop_id = sh.id
         AND ts.team_id = v_order.sales_team_id

        JOIN team_shop_depot tsd
          ON tsd.team_shop_id = ts.id
         AND tsd.depot_id = d.id

        JOIN team_shop_depot_store tsds
          ON tsds.team_shop_depot_id = tsd.id
         AND tsds.store_id = s.id

        WHERE s.id = v_product.store_id

          -- Shop phải thuộc admin của đơn hàng
          AND sh.account_id = v_order.admin_account_id

          -- Shop, depot, store phải hoạt động
          AND sh.is_lock = FALSE
          AND sh.is_delete = FALSE
          AND d.is_lock = FALSE
          AND d.is_delete = FALSE
          AND s.is_lock = FALSE
          AND s.is_delete = FALSE

          -- Các liên kết phân quyền phải hoạt động
          AND ts.is_lock = FALSE
          AND ts.is_delete = FALSE
          AND tsd.is_lock = FALSE
          AND tsd.is_delete = FALSE
          AND tsds.is_lock = FALSE
          AND tsds.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION
            'Team does not have active access to the product shop, depot, and store';
    END IF;

    -- 8. Không cho phép reservation trùng sản phẩm trong đơn hàng
    IF EXISTS (
        SELECT 1
        FROM order_v1_inventory_reservation r
        WHERE r.order_v1_id = p_order_v1_id
          AND r.product_id = p_product_id
    ) THEN
        RAISE EXCEPTION
            'Reservation already exists for order % and product %',
            p_order_v1_id,
            p_product_id;
    END IF;

    -- 9. Tổng số lượng reservation đang giữ
    -- SELECT COALESCE(SUM(r.quantity), 0)
    -- INTO v_reserved_quantity
    -- FROM order_v1_inventory_reservation r
    -- WHERE r.product_id = p_product_id
    --   AND r.status = 'reserved';

    -- 10. Tính tồn kho khả dụng
    v_available_quantity :=
        v_product.quantity_in
        - v_product.quantity_out;
        -- - v_reserved_quantity;

    IF v_available_quantity < p_quantity THEN
        RAISE EXCEPTION
            'Insufficient inventory. Product: %, available: %, requested: %',
            p_product_id,
            v_available_quantity,
            p_quantity;
    END IF;

    -- 11. Tạo reservation và trả về bản ghi vừa tạo
    RETURN QUERY
    INSERT INTO order_v1_inventory_reservation (
        order_v1_id,
        product_id,
        quantity,
        status
    )
    VALUES (
        p_order_v1_id,
        p_product_id,
        p_quantity,
        'reserved'
    )
    RETURNING *;

END;
$$;