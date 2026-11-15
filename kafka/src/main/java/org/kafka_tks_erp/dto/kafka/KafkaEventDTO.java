package org.kafka_tks_erp.dto.kafka;

import java.time.OffsetDateTime;
import java.util.UUID;

public record KafkaEventDTO(
        UUID id,
        UUID aggregateId,
        String aggregateType,
        String eventType,
        String topic,
        String payload,
        String status,
        Integer attempts,
        Integer maxAttempts,
        OffsetDateTime nextAttemptAt,
        String lockedBy,
        OffsetDateTime lockedUntil,
        String lastError,
        OffsetDateTime createdAt,
        OffsetDateTime publishedAt
) {
}
