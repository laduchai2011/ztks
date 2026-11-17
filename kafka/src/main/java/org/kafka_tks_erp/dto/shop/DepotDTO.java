package org.kafka_tks_erp.dto.shop;

import java.time.OffsetDateTime;
import java.util.UUID;

public record DepotDTO(
        UUID id,
        String name,
        String description,
        String content,
        String address,
        String phone,
        Boolean is_lock,
        Boolean is_delete,
        UUID shop_id,
        OffsetDateTime create_time
) {}