package org.kafka_tks_erp.dto.shop;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TeamShopDepotDTO(
        UUID id,
        Boolean is_lock,
        Boolean is_delete,
        UUID depot_id,
        UUID team_shop_id,
        OffsetDateTime create_time
) {}
