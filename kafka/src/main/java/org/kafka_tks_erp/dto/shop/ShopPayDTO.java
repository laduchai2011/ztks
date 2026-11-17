package org.kafka_tks_erp.dto.shop;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ShopPayDTO(
        UUID id,
        OffsetDateTime expiry,
        BigDecimal money,
        UUID pay_hook_id,
        UUID shop_id,
        UUID account_id,
        OffsetDateTime update_time,
        OffsetDateTime create_time
) {}
