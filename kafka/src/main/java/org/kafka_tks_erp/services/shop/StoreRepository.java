
package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.StoreDTO;
import org.kafka_tks_erp.dto.shop.StoreCursor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class StoreRepository {

    private static final String GET_STORES_FIRST_PAGE = """
        SELECT
            st.id,
            st.name,
            st.description,
            st.content,
            st.is_lock,
            st.is_delete,
            st.depot_id,
            st.create_time
        FROM store st
        INNER JOIN depot d
            ON d.id = st.depot_id
        WHERE
            d.is_delete = TRUE
            AND st.is_delete = FALSE
        ORDER BY st.create_time ASC, st.id ASC
        LIMIT ?
        """;

    private static final String GET_STORES_NEXT_PAGE = """
        SELECT
            st.id,
            st.name,
            st.description,
            st.content,
            st.is_lock,
            st.is_delete,
            st.depot_id,
            st.create_time
        FROM store st
        INNER JOIN depot d
            ON d.id = st.depot_id
        WHERE
            d.is_delete = TRUE
            AND st.is_delete = FALSE
            AND (st.create_time, st.id) > (?, ?)
        ORDER BY st.create_time ASC, st.id ASC
        LIMIT ?
        """;

    public CursorResponse<StoreDTO, StoreCursor>
    getStoresOfDeletedDepots(int limit, StoreCursor cursor) {

        List<StoreDTO> stores = new ArrayList<>();

        if (limit <= 0) {
            return new CursorResponse<>(
                    stores,
                    null,
                    false
            );
        }

        String sql = cursor == null
                ? GET_STORES_FIRST_PAGE
                : GET_STORES_NEXT_PAGE;

        StoreCursor nextCursor = null;
        boolean hasNext = false;

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            int parameterIndex = 1;

            if (cursor != null) {

                statement.setObject(
                        parameterIndex++,
                        cursor.create_time()
                );

                statement.setObject(
                        parameterIndex++,
                        cursor.id()
                );
            }

            // Lấy dư một bản ghi để kiểm tra còn trang tiếp theo không
            statement.setInt(parameterIndex, limit + 1);

            try (ResultSet rs = statement.executeQuery()) {

                while (rs.next()) {

                    if (stores.size() == limit) {
                        hasNext = true;
                        break;
                    }

                    UUID id = rs.getObject("id", UUID.class);

                    OffsetDateTime createTime =
                            rs.getObject(
                                    "create_time",
                                    OffsetDateTime.class
                            );

                    stores.add(new StoreDTO(
                            id,
                            rs.getString("name"),
                            rs.getString("description"),
                            rs.getString("content"),
                            rs.getBoolean("is_lock"),
                            rs.getBoolean("is_delete"),
                            rs.getObject("depot_id", UUID.class),
                            createTime
                    ));

                    // Cursor của bản ghi cuối cùng trong trang
                    nextCursor = new StoreCursor(
                            createTime,
                            id
                    );
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to get stores of deleted depots",
                    e
            );
        }

        return new CursorResponse<>(
                stores,
                nextCursor,
                hasNext
        );
    }

    public UUID getAccountIdByStoreId(UUID storeId) {

        if (storeId == null) {
            return null;
        }

        String sql = """
            SELECT s.account_id
            FROM store st
            INNER JOIN depot d
                ON d.id = st.depot_id
            INNER JOIN shop s
                ON s.id = d.shop_id
            WHERE st.id = ?
            """;

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setObject(1, storeId);

            try (ResultSet rs = statement.executeQuery()) {

                if (rs.next()) {
                    return rs.getObject("account_id", UUID.class);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to get account_id by store_id",
                    e
            );
        }

        return null;
    }
}
