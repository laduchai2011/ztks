
package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.TeamShopDepotStoreCursor;
import org.kafka_tks_erp.dto.shop.TeamShopDepotStoreDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TeamShopDepotStoreRepository {

    private static final String GET_FIRST_PAGE = """
        SELECT
            tsds.id,
            tsds.is_lock,
            tsds.is_delete,
            tsds.store_id,
            tsds.team_shop_depot_id,
            tsds.create_time
        FROM team_shop_depot_store tsds
        WHERE tsds.is_delete = FALSE
          AND (
              EXISTS (
                  SELECT 1
                  FROM store s
                  WHERE s.id = tsds.store_id
                    AND s.is_delete = TRUE
              )
              OR EXISTS (
                  SELECT 1
                  FROM team_shop_depot tsd
                  WHERE tsd.id = tsds.team_shop_depot_id
                    AND tsd.is_delete = TRUE
              )
          )
        ORDER BY tsds.create_time ASC, tsds.id ASC
        LIMIT ?
        """;

    private static final String GET_NEXT_PAGE = """
        SELECT
            tsds.id,
            tsds.is_lock,
            tsds.is_delete,
            tsds.store_id,
            tsds.team_shop_depot_id,
            tsds.create_time
        FROM team_shop_depot_store tsds
        WHERE tsds.is_delete = FALSE
          AND (
              EXISTS (
                  SELECT 1
                  FROM store s
                  WHERE s.id = tsds.store_id
                    AND s.is_delete = TRUE
              )
              OR EXISTS (
                  SELECT 1
                  FROM team_shop_depot tsd
                  WHERE tsd.id = tsds.team_shop_depot_id
                    AND tsd.is_delete = TRUE
              )
          )
          AND (tsds.create_time, tsds.id) > (?, ?)
        ORDER BY tsds.create_time ASC, tsds.id ASC
        LIMIT ?
        """;

    private static final String SOFT_DELETE = """
        UPDATE team_shop_depot_store
        SET is_delete = TRUE
        WHERE id = ?
          AND is_delete = FALSE
        """;

    public CursorResponse<TeamShopDepotStoreDTO, TeamShopDepotStoreCursor>
    getTeamShopDepotStoresOfDeletedParents(
            int limit,
            TeamShopDepotStoreCursor cursor
    ) {

        int safeLimit = Math.max(1, Math.min(limit, 1000));
        int fetchLimit = safeLimit + 1;

        String sql = cursor == null
                ? GET_FIRST_PAGE
                : GET_NEXT_PAGE;

        List<TeamShopDepotStoreDTO> items = new ArrayList<>();

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
                    items.add(new TeamShopDepotStoreDTO(
                            rs.getObject("id", UUID.class),
                            rs.getBoolean("is_lock"),
                            rs.getBoolean("is_delete"),
                            rs.getObject("store_id", UUID.class),
                            rs.getObject("team_shop_depot_id", UUID.class),
                            rs.getObject(
                                    "create_time",
                                    OffsetDateTime.class
                            )
                    ));
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Failed to get team_shop_depot_store records",
                    e
            );
        }

        boolean hasNext = items.size() > safeLimit;

        if (hasNext) {
            items.remove(items.size() - 1);
        }

        TeamShopDepotStoreCursor nextCursor = null;

        if (!items.isEmpty()) {
            TeamShopDepotStoreDTO lastItem =
                    items.get(items.size() - 1);

            nextCursor = new TeamShopDepotStoreCursor(
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

    public void softDeleteTeamShopDepotStore(UUID id) {

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
                    "Failed to soft delete team_shop_depot_store: " + id,
                    e
            );
        }
    }
}
