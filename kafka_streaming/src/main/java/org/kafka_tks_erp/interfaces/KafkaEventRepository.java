package org.kafka_tks_erp.interfaces;

import org.kafka_tks_erp.dto.kafka.CreateKafkaEventRequest;
import org.kafka_tks_erp.dto.kafka.KafkaEventResponse;

import java.sql.SQLException;

public interface KafkaEventRepository {

    KafkaEventResponse createEvent(
            CreateKafkaEventRequest request
    ) throws SQLException;

}
