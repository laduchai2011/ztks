package org.kafka_tks_erp.dto.product;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;


public record ProductCodeDTO(
        UUID id,
        String name,
        String description,
        String detail,
        List<ImageDTO> images,
        List<VideoDTO> videos,
        Boolean is_delete,
        UUID account_id,
        OffsetDateTime update_time,
        OffsetDateTime create_time
) {
}

