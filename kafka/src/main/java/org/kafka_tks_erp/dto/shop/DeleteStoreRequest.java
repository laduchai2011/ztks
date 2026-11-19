package org.kafka_tks_erp.dto.shop;

import java.util.UUID;

public record DeleteStoreRequest(
        UUID id,
        UUID account_id
) {}
