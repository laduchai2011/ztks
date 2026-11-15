package org.kafka_tks_erp.dto.kafka;

import java.util.UUID;

public record CreateKafkaEventRequest(
        UUID aggregateId,
        String aggregateType,
        String eventType,
        String payload
) {}
