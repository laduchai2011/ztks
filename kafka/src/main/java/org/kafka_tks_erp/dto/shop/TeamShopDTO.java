package org.kafka_tks_erp.dto.shop;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TeamShopDTO(
        UUID id,
        Boolean is_lock,
        Boolean is_delete,
        UUID shop_id,
        UUID team_id,
        OffsetDateTime create_time
) {}
