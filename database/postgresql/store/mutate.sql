CREATE OR REPLACE FUNCTION create_shop (
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_address VARCHAR(255),
    p_phone VARCHAR(255),
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    account_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
BEGIN
	-- Kiểm tra tài khoản có phải admin không
    IF NOT EXISTS (
        SELECT 1
        FROM account_information ai
        WHERE ai.account_id = p_account_id
          AND ai.account_type = 'admin'
    ) THEN
        RAISE EXCEPTION 'Không phải tài khoản admin.'
            USING ERRCODE = 'P0001';
    END IF;
	
    -- Tạo shop
    INSERT INTO shop (
        name,
        description,
        content,
        address,
        phone,
        account_id
    )
    VALUES (
        p_name,
        p_description,
        p_content,
        p_address,
        p_phone,
        p_account_id
    )
    RETURNING shop.id
    INTO v_shop_id;

    -- Tạo shop_pay
    INSERT INTO shop_pay (
		expiry,
        shop_id,
        account_id
    )
    VALUES (
		CURRENT_TIMESTAMP + INTERVAL '30 days',
        v_shop_id,
        p_account_id
    );

    -- Trả về shop vừa tạo
    RETURN QUERY
    SELECT
        s.id,
        s.name,
        s.description,
        s.content,
        s.address,
        s.phone,
        s.is_delete,
        s.account_id,
        s.create_time
    FROM shop s
    WHERE s.id = v_shop_id;
END;
$$;

-- CREATE OR REPLACE FUNCTION admin_set_shop_role_for_one_account (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_shop_id UUID,
--     p_account_id UUID,
--     p_admin_account_id UUID
-- )
-- RETURNS SETOF shop_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- 1. Kiểm tra tài khoản có phải admin không
--     IF NOT EXISTS (
--         SELECT 1
--         FROM account_information ai
--         WHERE ai.account_id = p_admin_account_id
--           AND ai.account_type = 'admin'
--     ) THEN
--         RAISE EXCEPTION 'Không phải tài khoản admin.'
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra tài khoản có phải chủ shop không
--     IF NOT EXISTS (
--         SELECT 1
--         FROM shop s
--         WHERE s.id = p_shop_id
--           AND s.account_id = p_admin_account_id
--           AND s.is_delete = FALSE
--     ) THEN
--         RAISE EXCEPTION 'Không phải tài khoản chủ shop.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Nếu đã có quyền thì cập nhật và trả về bản ghi
--     IF EXISTS (
--         SELECT 1
--         FROM shop_role sr
--         WHERE sr.shop_id = p_shop_id
--           AND sr.account_id = p_account_id
--           AND sr.type = p_type
--     ) THEN

--         RETURN QUERY
--         UPDATE shop_role sr
--         SET
--             is_lock = p_is_lock,
--             is_delete = FALSE
--         WHERE sr.shop_id = p_shop_id
--           AND sr.account_id = p_account_id
--           AND sr.type = p_type
--         RETURNING sr.*;

--     ELSE

--         -- 4. Nếu chưa có quyền thì thêm mới và trả về bản ghi
--         RETURN QUERY
--         INSERT INTO shop_role (
--             type,
--             is_lock,
--             is_delete,
--             shop_id,
--             account_id
--         )
--         VALUES (
--             p_type,
--             p_is_lock,
--             FALSE,
--             p_shop_id,
--             p_account_id
--         )
--         RETURNING *;

--     END IF;
-- END;
-- $$;

-- CREATE OR REPLACE FUNCTION admin_set_shop_role_for_one_team (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_shop_id UUID,
--     p_team_id UUID,
--     p_admin_account_id UUID
-- )
-- RETURNS SETOF shop_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- Kiểm tra tài khoản admin
--     IF NOT EXISTS (
--         SELECT 1
--         FROM account_information ai
--         WHERE ai.account_id = p_admin_account_id
--           AND ai.account_type = 'admin'
--     ) THEN
--         RAISE EXCEPTION 'Không phải tài khoản admin.'
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- Kiểm tra admin có phải chủ shop không
--     IF NOT EXISTS (
--         SELECT 1
--         FROM shop s
--         WHERE s.id = p_shop_id
--           AND s.account_id = p_admin_account_id
--     ) THEN
--         RAISE EXCEPTION 'Không phải tài khoản chủ shop.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- Kiểm tra team thuộc admin
--     IF NOT EXISTS (
--         SELECT 1
--         FROM team t
--         WHERE t.id = p_team_id
--           AND t.account_id = p_admin_account_id
--           AND t.is_delete = FALSE
--     ) THEN
--         RAISE EXCEPTION 'Không phải team hợp lệ của admin.'
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- Kiểm tra loại quyền
--     IF p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION 'Loại quyền không hợp lệ.'
--             USING ERRCODE = 'P0004';
--     END IF;

--     -- Cập nhật hoặc thêm quyền cho tất cả thành viên
--     RETURN QUERY
--     INSERT INTO shop_role AS sr (
--         type,
--         is_lock,
--         is_delete,
--         shop_id,
--         account_id
--     )
--     SELECT
--         p_type,
--         p_is_lock,
--         FALSE,
--         p_shop_id,
--         tm.account_id
--     FROM team_member tm
--     WHERE tm.team_id = p_team_id
--       AND tm.is_delete = FALSE

--     ON CONFLICT (shop_id, account_id, type)
--     DO UPDATE SET
--         is_lock = EXCLUDED.is_lock,
--         is_delete = FALSE

--     RETURNING sr.*;
-- END;
-- $$;

-- CREATE OR REPLACE FUNCTION leader_set_shop_role_for_one_account (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_shop_id UUID,
--     p_account_id UUID,
--     p_leader_account_id UUID
-- )
-- RETURNS SETOF shop_role
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_admin_account_id UUID;
--     v_leader_team_id UUID;
--     v_result shop_role%ROWTYPE;
-- BEGIN
--     -- 1. Lấy admin sở hữu shop từ shop_id
--     SELECT s.account_id
--     INTO v_admin_account_id
--     FROM shop s
--     JOIN account_information ai
--         ON ai.account_id = s.account_id
--     JOIN account a
--         ON a.id = s.account_id
--     WHERE s.id = p_shop_id
--       AND s.is_delete = FALSE
--       AND a.is_delete = FALSE
--       AND ai.account_type = 'admin';

--     IF NOT FOUND THEN
--         RAISE EXCEPTION
--             'Shop không tồn tại hoặc chủ shop không phải admin hợp lệ.'
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra leader thuộc admin của shop
--     -- và lấy team mà leader quản lý
--     SELECT tm.team_id
--     INTO v_leader_team_id
--     FROM team_member tm
--     JOIN team t
--         ON t.id = tm.team_id
--     JOIN account_information ai
--         ON ai.account_id = tm.account_id
--     JOIN account a
--         ON a.id = tm.account_id
--     WHERE tm.account_id = p_leader_account_id
--       AND tm.role = 'leader'
--       AND tm.is_delete = FALSE
--       AND tm.is_lock = FALSE
--       AND t.is_delete = FALSE
--       AND t.is_lock = FALSE
--       AND a.is_delete = FALSE
--       AND COALESCE(ai.added_by_id, ai.account_id)
--           = v_admin_account_id
--     LIMIT 1;

--     IF NOT FOUND THEN
--         RAISE EXCEPTION
--             'Leader không hợp lệ hoặc không thuộc admin của shop.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Kiểm tra tài khoản cần phân quyền:
--     -- phải cùng team với leader và cùng admin sở hữu shop
--     IF NOT EXISTS (
--         SELECT 1
--         FROM team_member tm
--         JOIN account_information ai
--             ON ai.account_id = tm.account_id
--         JOIN account a
--             ON a.id = tm.account_id
--         WHERE tm.team_id = v_leader_team_id
--           AND tm.account_id = p_account_id
--           AND tm.is_delete = FALSE
--           -- AND tm.is_lock = FALSE
--           AND a.is_delete = FALSE
--           AND COALESCE(ai.added_by_id, ai.account_id)
--               = v_admin_account_id
--     ) THEN
--         RAISE EXCEPTION
--             'Tài khoản không thuộc cùng team hoặc không thuộc admin của shop.'
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- 4. Cập nhật quyền đã tồn tại
--     UPDATE shop_role sr
--     SET
--         type = p_type,
--         is_lock = p_is_lock,
--         is_delete = FALSE
--     WHERE sr.shop_id = p_shop_id
--       AND sr.account_id = p_account_id
--       AND sr.type = p_type
--     RETURNING sr.* INTO v_result;

--     -- 5. Nếu chưa có quyền thì thêm mới
--     IF NOT FOUND THEN
--         INSERT INTO shop_role (
--             type,
--             is_lock,
--             is_delete,
--             shop_id,
--             account_id
--         )
--         VALUES (
--             p_type,
--             p_is_lock,
--             FALSE,
--             p_shop_id,
--             p_account_id
--         )
--         RETURNING * INTO v_result;
--     END IF;

--     -- 6. Trả về record sau khi thêm hoặc cập nhật
--     RETURN NEXT v_result;
--     RETURN;
-- END;
-- $$;


-- CREATE OR REPLACE FUNCTION leader_set_shop_role_for_one_team (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_shop_id UUID,
--     p_team_id UUID,
--     p_leader_account_id UUID
-- )
-- RETURNS SETOF shop_role
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_admin_account_id UUID;
-- BEGIN
--     -- 1. Lấy admin từ shop_id
--     SELECT s.account_id
--     INTO v_admin_account_id
--     FROM shop s
--     JOIN account_information ai
--         ON ai.account_id = s.account_id
--     JOIN account a
--         ON a.id = s.account_id
--     WHERE s.id = p_shop_id
--       AND s.is_delete = FALSE
--       AND a.is_delete = FALSE
--       AND ai.account_type = 'admin';

--     IF NOT FOUND THEN
--         RAISE EXCEPTION
--             'Shop không tồn tại hoặc chủ shop không phải admin hợp lệ.'
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra loại quyền
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION 'Loại quyền không hợp lệ.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Kiểm tra leader thuộc team được phân quyền
--     -- và cùng admin sở hữu shop
--     IF NOT EXISTS (
--         SELECT 1
--         FROM team_member tm
--         JOIN team t
--             ON t.id = tm.team_id
--         JOIN account_information ai
--             ON ai.account_id = tm.account_id
--         JOIN account a
--             ON a.id = tm.account_id
--         WHERE tm.team_id = p_team_id
--           AND tm.account_id = p_leader_account_id
--           AND tm.role = 'leader'
--           AND tm.is_delete = FALSE
--           AND tm.is_lock = FALSE
--           AND t.is_delete = FALSE
--           AND t.is_lock = FALSE
--           AND a.is_delete = FALSE
--           AND COALESCE(ai.added_by_id, ai.account_id)
--               = v_admin_account_id
--     ) THEN
--         RAISE EXCEPTION
--             'Leader không hợp lệ hoặc không thuộc admin của shop.'
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- 4. Kiểm tra team thuộc admin sở hữu shop
--     IF NOT EXISTS (
--         SELECT 1
--         FROM team t
--         WHERE t.id = p_team_id
--           AND t.account_id = v_admin_account_id
--           AND t.is_delete = FALSE
--           AND t.is_lock = FALSE
--     ) THEN
--         RAISE EXCEPTION
--             'Team không tồn tại hoặc không thuộc admin của shop.'
--             USING ERRCODE = 'P0004';
--     END IF;

--     -- 5. Kiểm tra các thành viên hợp lệ đều thuộc admin
--     IF EXISTS (
--         SELECT 1
--         FROM team_member tm
--         JOIN account a
--             ON a.id = tm.account_id
--         LEFT JOIN account_information ai
--             ON ai.account_id = tm.account_id
--         WHERE tm.team_id = p_team_id
--           AND (
--               tm.is_lock = TRUE
--               OR a.is_delete = TRUE
--               OR COALESCE(ai.added_by_id, ai.account_id)
--                   IS DISTINCT FROM v_admin_account_id
--           )
--     ) THEN
--         RAISE EXCEPTION
--             'Team có thành viên bị khóa, đã xóa hoặc không thuộc admin của shop.'
--             USING ERRCODE = 'P0005';
--     END IF;

--     -- 6. Cập nhật hoặc thêm quyền cho tất cả thành viên hợp lệ
--     RETURN QUERY
--     INSERT INTO shop_role AS sr (
--         type,
--         is_lock,
--         is_delete,
--         shop_id,
--         account_id
--     )
--     SELECT
--         p_type,
--         p_is_lock,
--         FALSE,
--         p_shop_id,
--         tm.account_id
--     FROM team_member tm
--     JOIN account a
--         ON a.id = tm.account_id
--     JOIN account_information ai
--         ON ai.account_id = tm.account_id
--     WHERE tm.team_id = p_team_id
--       AND tm.is_delete = FALSE
--       AND tm.is_lock = FALSE
--       AND a.is_delete = FALSE
--       AND COALESCE(ai.added_by_id, ai.account_id)
--           = v_admin_account_id

--     ON CONFLICT (shop_id, account_id, type)
--     DO UPDATE SET
--         is_lock = EXCLUDED.is_lock,
--         is_delete = FALSE

--     RETURNING sr.*;

-- END;
-- $$;


-- CREATE OR REPLACE FUNCTION admin_set_depot_role_for_one_account (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_depot_id UUID,
--     p_account_id UUID,
--     p_admin_account_id UUID
-- )
-- RETURNS SETOF depot_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- 1. Kiểm tra tài khoản có phải admin không
--     IF NOT EXISTS (
--         SELECT 1
--         FROM account_information ai
--         WHERE ai.account_id = p_admin_account_id
--           AND ai.account_type = 'admin'
--     ) THEN
--         RAISE EXCEPTION 'Không phải tài khoản admin.'
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra tài khoản admin có phải chủ shop
--     -- chứa depot này không, đồng thời depot và shop
--     -- phải chưa bị xóa
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s ON s.id = d.shop_id
--         WHERE d.id = p_depot_id
--           AND d.is_delete = FALSE
--           AND s.is_delete = FALSE
--           AND s.account_id = p_admin_account_id
--     ) THEN
--         RAISE EXCEPTION 'Không phải tài khoản chủ shop quản lý depot này.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Kiểm tra loại quyền hợp lệ
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION 'Loại quyền không hợp lệ: %.', p_type
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- 4. Nếu đã có quyền thì cập nhật và trả về bản ghi
--     RETURN QUERY
--     UPDATE depot_role dr
--     SET is_lock = p_is_lock
--     WHERE dr.depot_id = p_depot_id
--       AND dr.account_id = p_account_id
--       AND dr.type = p_type
--     RETURNING dr.*;

--     -- 5. Nếu chưa có quyền thì thêm mới
--     IF NOT FOUND THEN
--         RETURN QUERY
--         INSERT INTO depot_role (
--             type,
--             is_lock,
--             is_delete,
--             depot_id,
--             account_id
--         )
--         VALUES (
--             p_type,
--             p_is_lock,
--             FALSE,
--             p_depot_id,
--             p_account_id
--         )
--         RETURNING *;
--     END IF;
-- END;
-- $$;


-- CREATE OR REPLACE FUNCTION admin_set_depot_role_for_one_team (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_depot_id UUID,
--     p_team_id UUID,
--     p_admin_account_id UUID
-- )
-- RETURNS SETOF depot_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- 1. Kiểm tra tài khoản có phải admin không
--     IF NOT EXISTS (
--         SELECT 1
--         FROM account_information ai
--         WHERE ai.account_id = p_admin_account_id
--           AND ai.account_type = 'admin'
--     ) THEN
--         RAISE EXCEPTION 'Không phải tài khoản admin.'
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra loại quyền hợp lệ
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION 'Loại quyền không hợp lệ: %.', p_type
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Kiểm tra admin có phải chủ shop chứa depot không
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s ON s.id = d.shop_id
--         WHERE d.id = p_depot_id
--           AND d.is_delete = FALSE
--           AND s.is_delete = FALSE
--           AND s.account_id = p_admin_account_id
--     ) THEN
--         RAISE EXCEPTION
--             'Không phải chủ shop quản lý depot này.'
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- 4. Kiểm tra team tồn tại và chưa bị xóa
--     IF NOT EXISTS (
--         SELECT 1
--         FROM team t
--         WHERE t.id = p_team_id
--           AND t.is_delete = FALSE
--     ) THEN
--         RAISE EXCEPTION 'Team không tồn tại hoặc đã bị xóa.'
--             USING ERRCODE = 'P0004';
--     END IF;

--     -- 5. Cập nhật quyền của các thành viên đang tồn tại.
--     -- Xử lý cả thành viên đã bị xóa.
--     -- Bao gồm cả thành viên đang bị khóa và không bị khóa.
--     RETURN QUERY
--     INSERT INTO depot_role (
--         type,
--         is_lock,
--         is_delete,
--         depot_id,
--         account_id
--     )
--     SELECT
--         p_type,
--         p_is_lock,
--         FALSE,
--         p_depot_id,
--         tm.account_id
--     FROM team_member tm
--     WHERE tm.team_id = p_team_id
--     ON CONFLICT (depot_id, account_id, type)
--     DO UPDATE SET
--         is_lock = EXCLUDED.is_lock,
--         is_delete = FALSE
--     RETURNING *;

-- END;
-- $$;


-- CREATE OR REPLACE FUNCTION leader_set_depot_role_for_one_account (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_depot_id UUID,
--     p_account_id UUID,
--     p_leader_account_id UUID
-- )
-- RETURNS SETOF depot_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- 1. Kiểm tra loại quyền hợp lệ
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION 'Loại quyền không hợp lệ: %.', p_type
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra depot và shop tồn tại, chưa bị xóa
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s ON s.id = d.shop_id
--         WHERE d.id = p_depot_id
--           AND d.is_delete = FALSE
--           AND s.is_delete = FALSE
--     ) THEN
--         RAISE EXCEPTION 'Depot không tồn tại hoặc đã bị xóa.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Kiểm tra leader thuộc team do admin sở hữu shop quản lý depot
--     -- Đồng thời kiểm tra loại team phù hợp với loại quyền
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s
--             ON s.id = d.shop_id
--         JOIN team t
--             ON t.account_id = s.account_id
--         JOIN team_member tm
--             ON tm.team_id = t.id
--         WHERE d.id = p_depot_id
--           AND tm.account_id = p_leader_account_id
--           AND tm.role = 'leader'
--           AND tm.is_delete = FALSE
--           AND t.is_delete = FALSE
--           AND (
--               (p_type = 'sales' AND t.type = 'sales')
--               OR
--               (p_type = 'store' AND t.type = 'store')
--           )
--     ) THEN
--         RAISE EXCEPTION
--             'Leader không thuộc team của admin sở hữu shop quản lý depot.'
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- 4. Kiểm tra tài khoản được phân quyền cùng team với leader
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s
--             ON s.id = d.shop_id
--         JOIN team t
--             ON t.account_id = s.account_id
--         JOIN team_member leader_tm
--             ON leader_tm.team_id = t.id
--         JOIN team_member target_tm
--             ON target_tm.team_id = t.id
--            AND target_tm.account_id = p_account_id
--         WHERE d.id = p_depot_id
--           AND leader_tm.account_id = p_leader_account_id
--           AND leader_tm.role = 'leader'
--           AND leader_tm.is_delete = FALSE
--           AND target_tm.is_delete = FALSE
--           AND t.is_delete = FALSE
--           AND (
--               (p_type = 'sales' AND t.type = 'sale')
--               OR
--               (p_type = 'store' AND t.type = 'store')
--           )
--     ) THEN
--         RAISE EXCEPTION
--             'Tài khoản được phân quyền không thuộc cùng team với leader.'
--             USING ERRCODE = 'P0004';
--     END IF;

--     -- 5. Nếu đã có quyền thì cập nhật
--     RETURN QUERY
--     UPDATE depot_role dr
--     SET is_lock = p_is_lock
--     WHERE dr.depot_id = p_depot_id
--       AND dr.account_id = p_account_id
--       AND dr.type = p_type
--     RETURNING dr.*;

--     -- 6. Nếu chưa có quyền thì thêm mới
--     IF NOT FOUND THEN
--         RETURN QUERY
--         INSERT INTO depot_role (
--             type,
--             is_lock,
--             is_delete,
--             depot_id,
--             account_id
--         )
--         VALUES (
--             p_type,
--             p_is_lock,
--             FALSE,
--             p_depot_id,
--             p_account_id
--         )
--         RETURNING *;
--     END IF;
-- END;
-- $$;

-- CREATE OR REPLACE FUNCTION leader_set_depot_role_for_one_team (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_depot_id UUID,
--     p_team_id UUID,
--     p_leader_account_id UUID
-- )
-- RETURNS SETOF depot_role
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     -- 1. Kiểm tra loại quyền hợp lệ
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION 'Loại quyền không hợp lệ: %.', p_type
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra depot và shop tồn tại, chưa bị xóa
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s ON s.id = d.shop_id
--         WHERE d.id = p_depot_id
--           AND d.is_delete = FALSE
--           AND s.is_delete = FALSE
--     ) THEN
--         RAISE EXCEPTION 'Depot không tồn tại hoặc đã bị xóa.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Kiểm tra leader thuộc team do admin sở hữu shop quản lý depot
--     -- Đồng thời kiểm tra loại team phù hợp với loại quyền
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s
--             ON s.id = d.shop_id
--         JOIN team t
--             ON t.account_id = s.account_id
--         JOIN team_member tm
--             ON tm.team_id = t.id
--         WHERE d.id = p_depot_id
--           AND tm.account_id = p_leader_account_id
--           AND tm.role = 'leader'
--           AND tm.is_delete = FALSE
--           AND t.is_delete = FALSE
--           AND (
--               (p_type = 'sales' AND t.type = 'sales')
--               OR
--               (p_type = 'store' AND t.type = 'store')
--           )
--     ) THEN
--         RAISE EXCEPTION
--             'Leader không thuộc team của admin sở hữu shop quản lý depot.'
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- 4. Kiểm tra tài khoản được phân quyền cùng team với leader
--     IF NOT EXISTS (
--         SELECT 1
--         FROM depot d
--         JOIN shop s
--             ON s.id = d.shop_id
--         JOIN team t
--             ON t.account_id = s.account_id
--         JOIN team_member leader_tm
--             ON leader_tm.team_id = t.id
--         JOIN team_member target_tm
--             ON target_tm.team_id = t.id
--            AND target_tm.account_id = p_account_id
--         WHERE d.id = p_depot_id
--           AND leader_tm.account_id = p_leader_account_id
--           AND leader_tm.role = 'leader'
--           AND leader_tm.is_delete = FALSE
--           AND target_tm.is_delete = FALSE
--           AND t.is_delete = FALSE
--           AND (
--               (p_type = 'sales' AND t.type = 'sale')
--               OR
--               (p_type = 'store' AND t.type = 'store')
--           )
--     ) THEN
--         RAISE EXCEPTION
--             'Tài khoản được phân quyền không thuộc cùng team với leader.'
--             USING ERRCODE = 'P0004';
--     END IF;

--     -- 5. Nếu đã có quyền thì cập nhật
--     RETURN QUERY
--     UPDATE depot_role dr
--     SET is_lock = p_is_lock
--     WHERE dr.depot_id = p_depot_id
--       AND dr.account_id = p_account_id
--       AND dr.type = p_type
--     RETURNING dr.*;

--     -- 6. Nếu chưa có quyền thì thêm mới
--     IF NOT FOUND THEN
--         RETURN QUERY
--         INSERT INTO depot_role (
--             type,
--             is_lock,
--             is_delete,
--             depot_id,
--             account_id
--         )
--         VALUES (
--             p_type,
--             p_is_lock,
--             FALSE,
--             p_depot_id,
--             p_account_id
--         )
--         RETURNING *;
--     END IF;
-- END;
-- $$;

-- CREATE OR REPLACE FUNCTION leader_set_depot_role_for_one_team (
--     p_type VARCHAR(50),
--     p_is_lock BOOLEAN,
--     p_depot_id UUID,
--     p_team_id UUID,
--     p_leader_account_id UUID
-- )
-- RETURNS SETOF depot_role
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_admin_account_id UUID;
-- BEGIN
--     -- 1. Kiểm tra loại quyền hợp lệ
--     IF p_type IS NULL OR p_type NOT IN ('sales', 'store') THEN
--         RAISE EXCEPTION 'Loại quyền không hợp lệ: %.', p_type
--             USING ERRCODE = 'P0001';
--     END IF;

--     -- 2. Kiểm tra depot và shop tồn tại, chưa bị xóa
--     -- Lấy tài khoản chủ shop
--     SELECT s.account_id
--     INTO v_admin_account_id
--     FROM depot d
--     JOIN shop s ON s.id = d.shop_id
--     WHERE d.id = p_depot_id
--       AND d.is_delete = FALSE
--       AND s.is_delete = FALSE;

--     IF NOT FOUND THEN
--         RAISE EXCEPTION
--             'Depot không tồn tại hoặc shop quản lý depot đã bị xóa.'
--             USING ERRCODE = 'P0002';
--     END IF;

--     -- 3. Kiểm tra leader thuộc team của admin sở hữu shop
--     IF NOT EXISTS (
--         SELECT 1
--         FROM team t
--         JOIN team_member tm ON tm.team_id = t.id
--         WHERE t.id = p_team_id
--           AND t.account_id = v_admin_account_id
--           AND t.is_delete = FALSE
--           AND tm.account_id = p_leader_account_id
--           AND tm.role = 'leader'
--           AND tm.is_delete = FALSE
--           AND (
--               (p_type = 'sales' AND t.type = 'sales')
--               OR
--               (p_type = 'store' AND t.type = 'store')
--           )
--     ) THEN
--         RAISE EXCEPTION
--             'Leader không thuộc team hợp lệ của admin sở hữu shop.'
--             USING ERRCODE = 'P0003';
--     END IF;

--     -- 4. Cập nhật hoặc tạo depot_role cho tất cả thành viên
--     -- Bao gồm cả thành viên đã bị xóa mềm
--     RETURN QUERY
--     INSERT INTO depot_role AS dr (
--         type,
--         is_lock,
--         is_delete,
--         depot_id,
--         account_id
--     )
--     SELECT
--         p_type,
--         p_is_lock,
--         FALSE,
--         p_depot_id,
--         tm.account_id
--     FROM team_member tm
--     WHERE tm.team_id = p_team_id
--     ON CONFLICT (depot_id, account_id, type)
--     DO UPDATE SET
--         is_lock = EXCLUDED.is_lock,
--         is_delete = FALSE
--     RETURNING dr.*;

-- END;
-- $$;


CREATE OR REPLACE FUNCTION create_depot (
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_address VARCHAR(255),
    p_phone VARCHAR(255),
    p_shop_id UUID,
	p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    shop_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
	 IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Không phải SHOP của bạn.'
            USING ERRCODE = 'P0001';
    END IF;
	
    RETURN QUERY
    INSERT INTO depot (
        name,
        description,
        content,
        address,
        phone,
        shop_id
    )
    VALUES (
        p_name,
        p_description,
        p_content,
        p_address,
        p_phone,
        p_shop_id
    )
    RETURNING
        depot.id,
        depot.name,
        depot.description,
        depot.content,
        depot.address,
        depot.phone,
        depot.is_delete,
        depot.shop_id,
        depot.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION set_depot_role (
    p_role VARCHAR(50),
	p_type VARCHAR(50),
	is_lock BOOLEAN,
    p_depot_id UUID,
    p_account_id UUID
)
RETURNS SETOF depot_role
LANGUAGE plpgsql
AS $$
BEGIN
	IF EXISTS (
	    SELECT 1
	    FROM depot_role sr
	    WHERE sr.depot_id = p_depot_id
	      AND sr.account_id = p_account_id
		  AND sr.type = p_type
	) THEN
	
	    UPDATE depot_role
	    SET
	        type = p_type,
	        is_lock = FALSE,
	        is_delete = FALSE
	    WHERE depot_id = p_depot_id
	      AND account_id = p_account_id
		  AND sr.type = p_type;
	ELSE
	
	    INSERT INTO depot_role (
	        type,
	        is_lock,
	        is_delete,
	        depot_id,
	        account_id
	    )
	    VALUES (
	        p_type,
	        FALSE,
	        FALSE,
	        p_depot_id,
	        p_account_id
	    );

	END IF;
END;
$$;

CREATE OR REPLACE FUNCTION create_store (
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_depot_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    is_delete BOOLEAN,
    depot_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra depot có tồn tại và thuộc shop của account
    IF NOT EXISTS (
        SELECT 1
        FROM depot d
        INNER JOIN shop s
            ON s.id = d.shop_id
        WHERE d.id = p_depot_id
          AND s.account_id = p_account_id
          AND d.is_delete = FALSE
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot does not belong to this account';
    END IF;

    -- Tạo store
    RETURN QUERY
    INSERT INTO store (
        name,
        description,
        content,
        depot_id
    )
    VALUES (
        p_name,
        p_description,
        p_content,
        p_depot_id
    )
    RETURNING
        store.id,
        store.name,
        store.description,
        store.content,
        store.is_delete,
        store.depot_id,
        store.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION set_store_role (
    p_role VARCHAR(50),
	p_type VARCHAR(50),
	is_lock BOOLEAN,
    p_store_id UUID,
    p_account_id UUID
)
RETURNS SETOF store_role
LANGUAGE plpgsql
AS $$
BEGIN
	IF EXISTS (
	    SELECT 1
	    FROM store_role sr
	    WHERE sr.store_id = p_store_id
	      AND sr.account_id = p_account_id
		  AND sr.type = p_type
	) THEN
	
	    UPDATE store_role
	    SET
	        type = p_type,
	        is_lock = FALSE,
	        is_delete = FALSE
	    WHERE store_id = p_store_id
	      AND account_id = p_account_id
		  AND sr.type = p_type;
	ELSE
	
	    INSERT INTO store_role (
	        type,
	        is_lock,
	        is_delete,
	        store_id,
	        account_id
	    )
	    VALUES (
	        p_type,
	        FALSE,
	        FALSE,
	        p_store_id,
	        p_account_id
	    );

	END IF;
END;
$$;

CREATE OR REPLACE FUNCTION edit_shop (
	p_id UUID,
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_address VARCHAR(255),
    p_phone VARCHAR(255),
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    account_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
	RETURN QUERY
	UPDATE shop s
	SET
	    name = p_name,
	    description = p_description,
		content = p_content,
	    address = p_address,
	    phone = p_phone
	WHERE s.id = p_id AND s.account_id = p_account_id AND s.is_delete = FALSE
	RETURNING
	    s.id,
	    s.name,
	    s.description,
	    s.content,
	    s.address,
	    s.phone,
	    s.is_delete,
	    s.account_id,
	    s.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION delete_shop (
	p_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    account_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
	RETURN QUERY
	UPDATE shop s
	SET is_delete = TRUE
	WHERE s.id = p_id AND s.account_id = p_account_id AND s.is_delete = FALSE
	RETURNING
	    s.id,
	    s.name,
	    s.description,
	    s.content,
	    s.address,
	    s.phone,
	    s.is_delete,
	    s.account_id,
	    s.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION edit_depot (
    p_id UUID,
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_address VARCHAR(255),
    p_phone VARCHAR(255),
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    shop_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
BEGIN
    -- 1. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = p_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 2. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Update depot
    RETURN QUERY
    UPDATE depot d
    SET
        name = p_name,
        description = p_description,
        content = p_content,
        address = p_address,
        phone = p_phone
    WHERE d.id = p_id
      AND d.is_delete = FALSE
    RETURNING
        d.id,
        d.name,
        d.description,
        d.content,
        d.address,
        d.phone,
        d.is_delete,
        d.shop_id,
        d.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION delete_depot (
    p_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    address VARCHAR(255),
    phone VARCHAR(255),
    is_delete BOOLEAN,
    shop_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
BEGIN
    -- 1. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = p_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 2. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Update depot
    RETURN QUERY
    UPDATE depot d
    SET is_delete = TRUE
    WHERE d.id = p_id
      AND d.is_delete = FALSE
    RETURNING
        d.id,
        d.name,
        d.description,
        d.content,
        d.address,
        d.phone,
        d.is_delete,
        d.shop_id,
        d.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION edit_store (
    p_id UUID,
    p_name VARCHAR(50),
    p_description VARCHAR(255),
    p_content TEXT,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    is_delete BOOLEAN,
    depot_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
	v_depot_id UUID;
BEGIN
	-- 1. Lấy depot_id của store
    SELECT s.depot_id
    INTO v_depot_id
    FROM store s
    WHERE s.id = p_id
      AND s.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_depot_id IS NULL THEN
        RAISE EXCEPTION 'Store không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;
	
    -- 2. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = v_depot_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- 3. Update store
    RETURN QUERY
    UPDATE store s
    SET
        name = p_name,
        description = p_description,
        content = p_content
    WHERE s.id = p_id
      AND s.is_delete = FALSE
    RETURNING
        s.id,
        s.name,
        s.description,
        s.content,
        s.is_delete,
        s.depot_id,
        s.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION delete_store (
    p_id UUID,
    p_account_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    content TEXT,
    is_delete BOOLEAN,
    depot_id UUID,
    create_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_id UUID;
	v_depot_id UUID;
BEGIN
	-- 1. Lấy depot_id của store
    SELECT s.depot_id
    INTO v_depot_id
    FROM store s
    WHERE s.id = p_id
      AND s.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_depot_id IS NULL THEN
        RAISE EXCEPTION 'Store không tồn tại.'
            USING ERRCODE = 'P0001';
    END IF;
	
    -- 2. Lấy shop_id của depot
    SELECT d.shop_id
    INTO v_shop_id
    FROM depot d
    WHERE d.id = v_depot_id
      AND d.is_delete = FALSE;

    -- Không tìm thấy depot
    IF v_shop_id IS NULL THEN
        RAISE EXCEPTION 'Depot không tồn tại.'
            USING ERRCODE = 'P0002';
    END IF;

    -- 3. Kiểm tra shop có thuộc account hiện tại không
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = v_shop_id
          AND s.account_id = p_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION 'Depot không thuộc SHOP của bạn.'
            USING ERRCODE = 'P0003';
    END IF;

    -- 3. Update store
    RETURN QUERY
    UPDATE store s
    SET is_delete = TRUE
    WHERE s.id = p_id
      AND s.is_delete = FALSE
    RETURNING
        s.id,
        s.name,
        s.description,
        s.content,
        s.is_delete,
        s.depot_id,
        s.create_time;
END;
$$;

CREATE OR REPLACE FUNCTION create_shop_pay (
	p_money DECIMAL(20,2),
    p_shop_id UUID,
    p_account_id UUID
)
RETURNS shop_pay
LANGUAGE plpgsql
AS $$
DECLARE
    v_shop_pay shop_pay;
BEGIN
	-- Kiểm tra shop thuộc account
    IF NOT EXISTS (
        SELECT 1
        FROM zalo_app
        WHERE id = p_zalo_app_id
          AND account_id = p_account_id
    ) THEN
        RAISE EXCEPTION 'Không phải shop của bạn.'
            USING ERRCODE = 'P0001';
    END IF;
	
    INSERT INTO shop_pay (
        money,
        shop_id,
        account_id
    )
    VALUES (
        p_money,
        p_shop_id,
        p_account_id
    )
    RETURNING *
    INTO v_shop_pay;

    RETURN v_shop_pay;
END;
$$;


CREATE OR REPLACE FUNCTION add_team_shop (
    p_shop_id UUID,
    p_team_id UUID,
    p_admin_account_id UUID
)
RETURNS team_shop
LANGUAGE plpgsql
AS $$
DECLARE
    v_team_shop team_shop%ROWTYPE;
BEGIN
    -- Kiểm tra shop thuộc admin và chưa bị xóa
    IF NOT EXISTS (
        SELECT 1
        FROM shop s
        WHERE s.id = p_shop_id
          AND s.account_id = p_admin_account_id
          AND s.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION
            'Shop không tồn tại, đã bị xóa hoặc không thuộc quyền quản lý của admin';
    END IF;

    -- Kiểm tra team thuộc admin và chưa bị xóa
    IF NOT EXISTS (
        SELECT 1
        FROM team t
        WHERE t.id = p_team_id
          AND t.account_id = p_admin_account_id
          AND t.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION
            'Team không tồn tại, đã bị xóa hoặc không thuộc quyền quản lý của admin';
    END IF;

    -- Thêm mới hoặc khôi phục liên kết
    INSERT INTO team_shop (
        shop_id,
        team_id
    )
    VALUES (
        p_shop_id,
        p_team_id
    )
    ON CONFLICT (team_id, shop_id)
    DO UPDATE SET
        is_delete = FALSE
    RETURNING * INTO v_team_shop;

    RETURN v_team_shop;
END;
$$;


CREATE OR REPLACE FUNCTION lock_team_shop (
    p_id UUID,
    p_is_lock BOOLEAN,
    p_admin_account_id UUID
)
RETURNS team_shop
LANGUAGE plpgsql
AS $$
DECLARE
    v_team_shop team_shop%ROWTYPE;
BEGIN
    -- Kiểm tra liên kết và quyền sở hữu
    IF NOT EXISTS (
        SELECT 1
        FROM team_shop ts
        INNER JOIN shop s
            ON s.id = ts.shop_id
        INNER JOIN team t
            ON t.id = ts.team_id
        WHERE ts.id = p_id
          AND ts.is_delete = FALSE
          AND s.is_delete = FALSE
          AND t.is_delete = FALSE
          AND s.account_id = p_admin_account_id
          AND t.account_id = p_admin_account_id
    ) THEN
        RAISE EXCEPTION
            'Liên kết team-shop không tồn tại, đã bị xóa hoặc không thuộc quyền quản lý của admin';
    END IF;

    UPDATE team_shop
    SET is_lock = p_is_lock
    WHERE id = p_id
      AND is_delete = FALSE
    RETURNING * INTO v_team_shop;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Không thể cập nhật trạng thái khóa team-shop';
    END IF;

    RETURN v_team_shop;
END;
$$;


CREATE OR REPLACE FUNCTION add_team_shop_depot (
    p_team_shop_id UUID,
    p_depot_id UUID,
    p_admin_account_id UUID
)
RETURNS team_shop_depot
LANGUAGE plpgsql
AS $$
DECLARE
    v_team_shop_depot team_shop_depot%ROWTYPE;
BEGIN
    -- Kiểm tra team_shop, shop, team và quyền sở hữu admin
    IF NOT EXISTS (
        SELECT 1
        FROM team_shop ts
        INNER JOIN shop s
            ON s.id = ts.shop_id
        INNER JOIN team t
            ON t.id = ts.team_id
        WHERE ts.id = p_team_shop_id
          AND ts.is_delete = FALSE
          AND s.is_delete = FALSE
          AND t.is_delete = FALSE
          AND s.account_id = p_admin_account_id
          AND t.account_id = p_admin_account_id
    ) THEN
        RAISE EXCEPTION
            'Liên kết team-shop không hợp lệ hoặc không thuộc quyền quản lý của admin';
    END IF;

    -- Depot phải thuộc đúng shop và chưa bị xóa
    IF NOT EXISTS (
        SELECT 1
        FROM depot d
        INNER JOIN team_shop ts
            ON ts.shop_id = d.shop_id
        WHERE ts.id = p_team_shop_id
          AND d.id = p_depot_id
          AND ts.is_delete = FALSE
          AND d.is_delete = FALSE
    ) THEN
        RAISE EXCEPTION
            'Depot không tồn tại, đã bị xóa hoặc không thuộc shop được liên kết';
    END IF;

    INSERT INTO team_shop_depot (
        depot_id,
        team_shop_id
    )
    VALUES (
        p_depot_id,
        p_team_shop_id
    )
    ON CONFLICT (team_shop_id, depot_id)
    DO UPDATE SET
        is_lock = FALSE,
        is_delete = FALSE
    RETURNING * INTO v_team_shop_depot;

    RETURN v_team_shop_depot;
END;
$$;


CREATE OR REPLACE FUNCTION lock_team_shop_depot (
    p_id UUID,
    p_is_lock BOOLEAN,
    p_admin_account_id UUID
)
RETURNS team_shop_depot
LANGUAGE plpgsql
AS $$
DECLARE
    v_team_shop_depot team_shop_depot%ROWTYPE;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM team_shop_depot tsd
        INNER JOIN team_shop ts
            ON ts.id = tsd.team_shop_id
        INNER JOIN shop s
            ON s.id = ts.shop_id
        INNER JOIN team t
            ON t.id = ts.team_id
        INNER JOIN depot d
            ON d.id = tsd.depot_id
           AND d.shop_id = s.id
        WHERE tsd.id = p_id
          AND tsd.is_delete = FALSE
          AND ts.is_delete = FALSE
          AND s.is_delete = FALSE
          AND t.is_delete = FALSE
          AND d.is_delete = FALSE
          AND s.account_id = p_admin_account_id
          AND t.account_id = p_admin_account_id
    ) THEN
        RAISE EXCEPTION
            'Liên kết team-shop-depot không hợp lệ, đã bị xóa hoặc không thuộc quyền quản lý của admin';
    END IF;

    UPDATE team_shop_depot
    SET is_lock = p_is_lock
    WHERE id = p_id
      AND is_delete = FALSE
    RETURNING * INTO v_team_shop_depot;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Không thể cập nhật trạng thái khóa team-shop-depot';
    END IF;

    RETURN v_team_shop_depot;
END;
$$;


CREATE OR REPLACE FUNCTION add_team_shop_depot_store (
    p_team_shop_depot_id UUID,
    p_store_id UUID,
    p_admin_account_id UUID
)
RETURNS team_shop_depot_store
LANGUAGE plpgsql
AS $$
DECLARE
    v_team_shop_depot_store team_shop_depot_store%ROWTYPE;
BEGIN
    -- Kiểm tra toàn bộ quan hệ và quyền sở hữu
    IF NOT EXISTS (
        SELECT 1
        FROM team_shop_depot tsd
        INNER JOIN team_shop ts
            ON ts.id = tsd.team_shop_id
        INNER JOIN shop s
            ON s.id = ts.shop_id
        INNER JOIN team t
            ON t.id = ts.team_id
        INNER JOIN depot d
            ON d.id = tsd.depot_id
           AND d.shop_id = s.id
        WHERE tsd.id = p_team_shop_depot_id
          AND tsd.is_delete = FALSE
          AND ts.is_delete = FALSE
          AND s.is_delete = FALSE
          AND t.is_delete = FALSE
          AND d.is_delete = FALSE
          AND s.account_id = p_admin_account_id
          AND t.account_id = p_admin_account_id
    ) THEN
        RAISE EXCEPTION
            'Liên kết team-shop-depot không hợp lệ hoặc không thuộc quyền quản lý của admin';
    END IF;

    -- Store phải thuộc đúng depot được liên kết
    IF NOT EXISTS (
        SELECT 1
        FROM store st
        INNER JOIN depot d
            ON d.id = st.depot_id
        INNER JOIN team_shop_depot tsd
            ON tsd.depot_id = d.id
        INNER JOIN team_shop ts
            ON ts.id = tsd.team_shop_id
        INNER JOIN shop s
            ON s.id = ts.shop_id
           AND s.id = d.shop_id
        INNER JOIN team t
            ON t.id = ts.team_id
        WHERE tsd.id = p_team_shop_depot_id
          AND st.id = p_store_id
          AND st.is_delete = FALSE
          AND d.is_delete = FALSE
          AND tsd.is_delete = FALSE
          AND ts.is_delete = FALSE
          AND s.is_delete = FALSE
          AND t.is_delete = FALSE
          AND s.account_id = p_admin_account_id
          AND t.account_id = p_admin_account_id
    ) THEN
        RAISE EXCEPTION
            'Store không tồn tại, đã bị xóa hoặc không thuộc depot được liên kết';
    END IF;

    INSERT INTO team_shop_depot_store (
        store_id,
        team_shop_depot_id
    )
    VALUES (
        p_store_id,
        p_team_shop_depot_id
    )
    ON CONFLICT (team_shop_depot_id, store_id)
    DO UPDATE SET
        is_lock = FALSE,
        is_delete = FALSE
    RETURNING * INTO v_team_shop_depot_store;

    RETURN v_team_shop_depot_store;
END;
$$;


CREATE OR REPLACE FUNCTION lock_team_shop_depot_store (
    p_id UUID,
    p_is_lock BOOLEAN,
    p_admin_account_id UUID
)
RETURNS team_shop_depot_store
LANGUAGE plpgsql
AS $$
DECLARE
    v_team_shop_depot_store team_shop_depot_store%ROWTYPE;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM team_shop_depot_store tsds
        INNER JOIN team_shop_depot tsd
            ON tsd.id = tsds.team_shop_depot_id
        INNER JOIN team_shop ts
            ON ts.id = tsd.team_shop_id
        INNER JOIN shop s
            ON s.id = ts.shop_id
        INNER JOIN team t
            ON t.id = ts.team_id
        INNER JOIN depot d
            ON d.id = tsd.depot_id
           AND d.shop_id = s.id
        INNER JOIN store st
            ON st.id = tsds.store_id
           AND st.depot_id = d.id
        WHERE tsds.id = p_id
          AND tsds.is_delete = FALSE
          AND tsd.is_delete = FALSE
          AND ts.is_delete = FALSE
          AND s.is_delete = FALSE
          AND t.is_delete = FALSE
          AND d.is_delete = FALSE
          AND st.is_delete = FALSE
          AND s.account_id = p_admin_account_id
          AND t.account_id = p_admin_account_id
    ) THEN
        RAISE EXCEPTION
            'Liên kết team-shop-depot-store không hợp lệ, đã bị xóa hoặc không thuộc quyền quản lý của admin';
    END IF;

    UPDATE team_shop_depot_store
    SET is_lock = p_is_lock
    WHERE id = p_id
      AND is_delete = FALSE
    RETURNING * INTO v_team_shop_depot_store;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Không thể cập nhật trạng thái khóa team-shop-depot-store';
    END IF;

    RETURN v_team_shop_depot_store;
END;
$$;
