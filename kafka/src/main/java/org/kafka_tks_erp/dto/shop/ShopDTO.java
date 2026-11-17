package org.kafka_tks_erp.dto.shop;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ShopDTO(
        UUID id,
        String name,
        String description,
        String content,
        String address,
        String phone,
        Boolean is_lock,
        Boolean is_delete,
        UUID account_id,
        OffsetDateTime create_time
) {}