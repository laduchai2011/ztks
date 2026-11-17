package org.kafka_tks_erp.dto.product;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ProductDTO(
        UUID id,
        String name,
        String description,
        String detail,

        Integer quantityIn,
        Integer quantityOut,

        List<String> images,
        List<String> videos,

        Boolean isCompelledPrice,
        BigDecimal unitPrice,

        Boolean isLock,
        Boolean isDelete,

        UUID storeId,
        UUID productCodeId,
        UUID accountId,

        OffsetDateTime updateTime,
        OffsetDateTime createTime
) {}
