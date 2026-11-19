package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.TeamShopDepotCursor;
import org.kafka_tks_erp.dto.shop.TeamShopDepotDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TeamShopDepotRepository {

    private static final String GET_FIRST_PAGE = """
        SELECT
            tsd.id,
            tsd.is_lock,
            tsd.is_delete,
            tsd.depot_id,
            tsd.team_shop_id,
            tsd.create_time
        FROM team_shop_depot tsd
        WHERE tsd.is_delete = FALSE
          AND (
              EXISTS (
                  SELECT 1
                  FROM depot d
                  WHERE d.id = tsd.depot_id
                    AND d.is_delete = TRUE
              )
              OR EXISTS (
                  SELECT 1
                  FROM team_shop ts
                  WHERE ts.id = tsd.team_shop_id
                    AND ts.is_delete = TRUE
              )
          )
        ORDER BY tsd.create_time ASC, tsd.id ASC
        LIMIT ?
        """;

    private static final String GET_NEXT_PAGE = """
        SELECT
            tsd.id,
            tsd.is_lock,
            tsd.is_delete,
            tsd.depot_id,
            tsd.team_shop_id,
            tsd.create_time
        FROM team_shop_depot tsd
        WHERE tsd.is_delete = FALSE
          AND (
              EXISTS (
                  SELECT 1
                  FROM depot d
                  WHERE d.id = tsd.depot_id
                    AND d.is_delete = TRUE
              )
              OR EXISTS (
                  SELECT 1
                  FROM team_shop ts
                  WHERE ts.id = tsd.team_shop_id
                    AND ts.is_delete = TRUE
              )
          )
          AND (tsd.create_time, tsd.id) > (?, ?)
        ORDER BY tsd.create_time ASC, tsd.id ASC
        LIMIT ?
        """;

    private static final String SOFT_DELETE = """
        UPDATE team_shop_depot
        SET is_delete = TRUE
        WHERE id = ?
          AND is_delete = FALSE
        """;

    public CursorResponse<TeamShopDepotDTO, TeamShopDepotCursor>
    getTeamShopDepotsOfDeletedParents(
            int limit,
            TeamShopDepotCursor cursor
    ) {

        int safeLimit = Math.max(1, Math.min(limit, 1000));
        int fetchLimit = safeLimit + 1;

        String sql = cursor == null
                ? GET_FIRST_PAGE
                : GET_NEXT_PAGE;

        List<TeamShopDepotDTO> items = new ArrayList<>();

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

            statement.setInt(parameterIndex, fetchLimit);

            try (ResultSet rs = statement.executeQuery()) {

                while (rs.next()) {

                    items.add(new TeamShopDepotDTO(
                            rs.getObject("id", UUID.class),
                            rs.getBoolean("is_lock"),
                            rs.getBoolean("is_delete"),
                            rs.getObject("depot_id", UUID.class),
                            rs.getObject("team_shop_id", UUID.class),
                            rs.getObject(
                                    "create_time",
                                    java.time.OffsetDateTime.class
                            )
                    ));
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to get team_shop_depot records",
                    e
            );
        }

        boolean hasNext = items.size() > safeLimit;

        if (hasNext) {
            items.remove(items.size() - 1);
        }

        TeamShopDepotCursor nextCursor = null;

        if (!items.isEmpty()) {

            TeamShopDepotDTO lastItem =
                    items.get(items.size() - 1);

            nextCursor = new TeamShopDepotCursor(
                    lastItem.create_time(),
                    lastItem.id()
            );
        }

        return new CursorResponse<>(
                items,
                nextCursor,
                hasNext
        );
    }

    public void softDeleteTeamShopDepot(UUID id) {

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(SOFT_DELETE)
        ) {

            statement.setObject(1, id);

            statement.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to soft delete team_shop_depot: " + id,
                    e
            );
        }
    }
}
