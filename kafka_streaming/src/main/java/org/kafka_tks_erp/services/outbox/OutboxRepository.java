package org.kafka_tks_erp.services.outbox;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.kafka.KafkaEventDTO;
import org.kafka_tks_erp.utils.KafkaEventLogger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.time.OffsetDateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OutboxRepository {

    /**
     * Claim events từ PostgreSQL.
     */
    public List<KafkaEventDTO> claimBatch(
            String workerId,
            int limit,
            int leaseSeconds
    ) throws SQLException {

        String sql = """
            SELECT *
            FROM claim_kafka_events(?, ?, ?)
            """;

        List<KafkaEventDTO> events = new ArrayList<>();

        KafkaEventLogger.printEvents(events);

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setString(1, workerId);

            statement.setInt(2, limit);

            statement.setInt(3, leaseSeconds);

            try (ResultSet rs = statement.executeQuery()) {

                while (rs.next()) {

                    events.add(mapEvent(rs));
                }
            }
        }

        return events;
    }

    /**
     * Mapping đầy đủ 15 trường.
     */
    private KafkaEventDTO mapEvent(
            ResultSet rs
    ) throws SQLException {

        return new KafkaEventDTO(

                rs.getObject("id", UUID.class),

                rs.getObject("aggregate_id", UUID.class),

                rs.getString("aggregate_type"),

                rs.getString("event_type"),

                rs.getString("topic"),

                rs.getString("payload"),

                rs.getString("status"),

                rs.getInt("attempts"),

                rs.getInt("max_attempts"),

                rs.getObject(
                        "next_attempt_at",
                        OffsetDateTime.class
                ),

                rs.getString("locked_by"),

                rs.getObject(
                        "locked_until",
                        OffsetDateTime.class
                ),

                rs.getString("last_error"),

                rs.getObject(
                        "created_at",
                        OffsetDateTime.class
                ),

                rs.getObject(
                        "published_at",
                        OffsetDateTime.class
                )
        );
    }

    /**
     * Gia hạn lease.
     */
    public boolean renewLease(
            UUID eventId,
            String workerId,
            int leaseSeconds
    ) throws SQLException {

        String sql = """
            SELECT renew_kafka_event_lease(?, ?, ?)
            """;

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setObject(1, eventId);

            statement.setString(2, workerId);

            statement.setInt(3, leaseSeconds);

            try (ResultSet rs = statement.executeQuery()) {

                return rs.next() && rs.getBoolean(1);
            }
        }
    }

    /**
     * Đánh dấu event đã publish thành công.
     */
    public boolean markPublished(
            UUID eventId,
            String workerId
    ) throws SQLException {

        String sql = """
            SELECT mark_kafka_event_published(?, ?)
            """;

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setObject(1, eventId);

            statement.setString(2, workerId);

            try (ResultSet rs = statement.executeQuery()) {

                return rs.next() && rs.getBoolean(1);
            }
        }
    }

    /**
     * Retry event khi publish thất bại.
     */
    public boolean retry(
            UUID eventId,
            String workerId,
            String error
    ) throws SQLException {

        String sql = """
            SELECT retry_kafka_event(?, ?, ?)
            """;

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setObject(1, eventId);

            statement.setString(2, workerId);

            statement.setString(3, error);

            try (ResultSet rs = statement.executeQuery()) {

                return rs.next() && rs.getBoolean(1);
            }
        }
    }

    /**
     * Chuyển các event hết lượt retry thành failed.
     */
    public int failExhaustedEvents() throws SQLException {

        String sql = """
            SELECT fail_exhausted_kafka_events()
            """;

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                ResultSet rs = statement.executeQuery()
        ) {

            return rs.next() ? rs.getInt(1) : 0;
        }
    }
}