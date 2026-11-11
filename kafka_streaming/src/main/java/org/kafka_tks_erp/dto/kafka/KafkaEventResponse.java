package org.kafka_tks_erp.dto.kafka;

import java.util.UUID;
import java.time.LocalDateTime;

public record KafkaEventResponse(
        UUID id,
        UUID aggregateId,
        String aggregateType,
        String eventType,
        String payload,
        String status,
        LocalDateTime createdAt
) {}
