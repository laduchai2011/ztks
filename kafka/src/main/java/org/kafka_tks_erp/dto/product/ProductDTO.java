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

        Integer quantity_in,
        Integer quantity_out,

        List<ImageDTO> images,
        List<VideoDTO> videos,

        Boolean is_compelled_price,
        BigDecimal unit_price,

        Boolean is_lock,
        Boolean is_delete,

        UUID store_id,
        UUID product_code_id,
        UUID account_id,

        OffsetDateTime update_time,
        OffsetDateTime create_time
) {}
