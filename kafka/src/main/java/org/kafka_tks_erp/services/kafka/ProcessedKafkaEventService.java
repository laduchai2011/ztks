
package org.kafka_tks_erp.services.kafka;

import org.kafka_tks_erp.config.PostgresqlConfig;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ProcessedKafkaEventService {

    private static final String SQL = """
        SELECT register_processed_kafka_event(
            ?,
            ?::UUID,
            ?,
            ?
        )
    """;

    public boolean register(
            String consumerName,
            String eventId,
            String eventType,
            String topic
    ) throws Exception {

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(SQL)
        ) {

            statement.setString(1, consumerName);
            statement.setString(2, eventId);
            statement.setString(3, eventType);
            statement.setString(4, topic);

            try (ResultSet result = statement.executeQuery()) {

                if (result.next()) {
                    return result.getBoolean(1);
                }
            }
        }

        throw new RuntimeException(
                "Cannot register processed Kafka event: " + eventId
        );
    }
}
