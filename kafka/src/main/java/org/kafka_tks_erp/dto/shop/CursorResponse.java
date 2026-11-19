package org.kafka_tks_erp.dto.shop;

import java.util.List;

public record CursorResponse<T, C>(
        List<T> items,
        C nextCursor,
        boolean hasNext
) {}
