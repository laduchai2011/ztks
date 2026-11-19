
package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.DepotDTO;
import org.kafka_tks_erp.dto.shop.DepotCursor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class DepotRepository {

    private static final String GET_DEPOTS_FIRST_PAGE = """
        SELECT
            d.id,
            d.name,
            d.description,
            d.content,
            d.address,
            d.phone,
            d.is_lock,
            d.is_delete,
            d.shop_id,
            d.create_time
        FROM depot d
        INNER JOIN shop s
            ON s.id = d.shop_id
        WHERE
            s.is_delete = TRUE
            AND d.is_delete = FALSE
        ORDER BY d.create_time ASC, d.id ASC
        LIMIT ?
        """;

    private static final String GET_DEPOTS_NEXT_PAGE = """
        SELECT
            d.id,
            d.name,
            d.description,
            d.content,
            d.address,
            d.phone,
            d.is_lock,
            d.is_delete,
            d.shop_id,
            d.create_time
        FROM depot d
        INNER JOIN shop s
            ON s.id = d.shop_id
        WHERE
            s.is_delete = TRUE
            AND d.is_delete = FALSE
            AND (d.create_time, d.id) > (?, ?)
        ORDER BY d.create_time ASC, d.id ASC
        LIMIT ?
        """;

    public CursorResponse<DepotDTO, DepotCursor>
    getDepotsOfDeletedShops(int limit, DepotCursor cursor) {

        List<DepotDTO> depots = new ArrayList<>();

        if (limit <= 0) {
            return new CursorResponse<>(
                    depots, null, false
            );
        }

        String sql = cursor == null
                ? GET_DEPOTS_FIRST_PAGE
                : GET_DEPOTS_NEXT_PAGE;

        DepotCursor nextCursor = null;
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
                        cursor.createTime()
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

                    if (depots.size() == limit) {
                        hasNext = true;
                        break;
                    }

                    UUID id = rs.getObject("id", UUID.class);

                    OffsetDateTime createTime =
                            rs.getObject(
                                    "create_time",
                                    OffsetDateTime.class
                            );

                    depots.add(new DepotDTO(
                            id,
                            rs.getString("name"),
                            rs.getString("description"),
                            rs.getString("content"),
                            rs.getString("address"),
                            rs.getString("phone"),
                            rs.getBoolean("is_lock"),
                            rs.getBoolean("is_delete"),
                            rs.getObject("shop_id", UUID.class),
                            createTime
                    ));

                    // Cursor của bản ghi cuối cùng trong trang
                    nextCursor = new DepotCursor(
                            createTime,
                            id
                    );
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to get depots of deleted shops",
                    e
            );
        }

        return new CursorResponse<>(
                depots,
                nextCursor,
                hasNext
        );
    }

    public UUID getAccountIdByDepotId(UUID depotId) {

        if (depotId == null) {
            return null;
        }

        String sql = """
        SELECT s.account_id
        FROM depot d
        INNER JOIN shop s
            ON s.id = d.shop_id
        WHERE d.id = ?
        """;

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setObject(1, depotId);

            try (ResultSet rs = statement.executeQuery()) {

                if (rs.next()) {
                    return rs.getObject("account_id", UUID.class);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to get account_id by depot_id",
                    e
            );
        }

        return null;
    }
}
