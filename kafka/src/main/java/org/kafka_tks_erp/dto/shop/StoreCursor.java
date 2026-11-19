package org.kafka_tks_erp.dto.shop;

import java.time.OffsetDateTime;
import java.util.UUID;

public record StoreCursor(
        OffsetDateTime create_time,
        UUID id
) {}
