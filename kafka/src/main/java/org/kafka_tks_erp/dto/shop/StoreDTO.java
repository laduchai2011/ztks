package org.kafka_tks_erp.dto.shop;

import java.time.OffsetDateTime;
import java.util.UUID;

public record StoreDTO(
        UUID id,
        String name,
        String description,
        String content,
        Boolean is_lock,
        Boolean is_delete,
        UUID depot_id,
        OffsetDateTime create_time
) {}
