package org.kafka_tks_erp.dto.kafka;

import java.util.UUID;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.JsonNode;

public record KafkaEventResponse(
        UUID id,
        UUID aggregateId,
        String aggregateType,
        String eventType,
        JsonNode payload,
        String status,
        LocalDateTime createdAt
) {}
