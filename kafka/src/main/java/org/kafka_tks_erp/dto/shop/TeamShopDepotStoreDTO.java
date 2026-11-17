package org.kafka_tks_erp.dto.shop;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TeamShopDepotStoreDTO(
        UUID id,
        Boolean is_lock,
        Boolean is_delete,
        UUID store_id,
        UUID team_shop_depot_id,
        OffsetDateTime create_time
) {}
