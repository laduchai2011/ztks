package org.kafka_tks_erp.dto.product;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;


public record ProductCodeDTO(
        UUID id,
        String name,
        String detail,
        List<ImageDTO> images,
        List<VideoDTO> videos,
        Boolean isDelete,
        UUID accountId,
        OffsetDateTime createTime,
        String description,
        OffsetDateTime updateTime
) {
}
