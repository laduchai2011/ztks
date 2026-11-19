package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.TeamShopDTO;
import org.kafka_tks_erp.dto.shop.TeamShopCursor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TeamShopRepository {

    private static final String GET_FIRST_PAGE = """
        SELECT
            ts.id,
            ts.is_lock,
            ts.is_delete,
            ts.shop_id,
            ts.team_id,
            ts.create_time
        FROM team_shop ts
        WHERE
            ts.is_delete = FALSE
            AND (
                EXISTS (
                    SELECT 1
                    FROM shop s
                    WHERE s.id = ts.shop_id
                      AND s.is_delete = TRUE
                )
                OR
                EXISTS (
                    SELECT 1
                    FROM team t
                    WHERE t.id = ts.team_id
                      AND t.is_delete = TRUE
                )
            )
        ORDER BY ts.create_time ASC, ts.id ASC
        LIMIT ?
        """;

    private static final String GET_NEXT_PAGE = """
        SELECT
            ts.id,
            ts.is_lock,
            ts.is_delete,
            ts.shop_id,
            ts.team_id,
            ts.create_time
        FROM team_shop ts
        WHERE
            ts.is_delete = FALSE
            AND (
                EXISTS (
                    SELECT 1
                    FROM shop s
                    WHERE s.id = ts.shop_id
                      AND s.is_delete = TRUE
                )
                OR
                EXISTS (
                    SELECT 1
                    FROM team t
                    WHERE t.id = ts.team_id
                      AND t.is_delete = TRUE
                )
            )
            AND (ts.create_time, ts.id) > (?, ?)
        ORDER BY ts.create_time ASC, ts.id ASC
        LIMIT ?
        """;

    public CursorResponse<TeamShopDTO, TeamShopCursor>
    getTeamShopsOfDeletedParents(int limit, TeamShopCursor cursor) {

        List<TeamShopDTO> items = new ArrayList<>();

        if (limit <= 0) {
            return new CursorResponse<>(items, null, false);
        }

        String sql = cursor == null
                ? GET_FIRST_PAGE
                : GET_NEXT_PAGE;

        TeamShopCursor nextCursor = null;
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

            statement.setInt(parameterIndex, limit + 1);

            try (ResultSet rs = statement.executeQuery()) {

                while (rs.next()) {

                    if (items.size() == limit) {
                        hasNext = true;
                        break;
                    }

                    UUID id = rs.getObject("id", UUID.class);

                    OffsetDateTime createTime =
                            rs.getObject(
                                    "create_time",
                                    OffsetDateTime.class
                            );

                    items.add(new TeamShopDTO(
                            id,
                            rs.getBoolean("is_lock"),
                            rs.getBoolean("is_delete"),
                            rs.getObject("shop_id", UUID.class),
                            rs.getObject("team_id", UUID.class),
                            createTime
                    ));

                    nextCursor = new TeamShopCursor(
                            createTime,
                            id
                    );
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to get team shops of deleted parents",
                    e
            );
        }

        return new CursorResponse<>(
                items,
                nextCursor,
                hasNext
        );
    }

    private static final String SOFT_DELETE_TEAM_SHOP = """
    UPDATE team_shop
    SET
        is_delete = TRUE
    WHERE id = ?
      AND is_delete = FALSE
    """;

    public boolean softDeleteTeamShop(UUID id) {

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(SOFT_DELETE_TEAM_SHOP)
        ) {

            statement.setObject(1, id);

            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to soft delete team_shop",
                    e
            );
        }
    }
}