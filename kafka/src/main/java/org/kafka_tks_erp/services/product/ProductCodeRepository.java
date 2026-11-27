
package org.kafka_tks_erp.services.product;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.product.ProductCodeDTO;
import org.kafka_tks_erp.dto.product.ImageDTO;
import org.kafka_tks_erp.dto.product.VideoDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ProductCodeRepository {

    private static final ObjectMapper objectMapper =
            new ObjectMapper().registerModule(new JavaTimeModule());

    private static final String SQL_FIRST_BATCH = """
        SELECT
            id,
            name,
            description,
            detail,
            images,
            videos,
            is_delete,
            account_id,
            update_time,
            create_time
        FROM product_code
        ORDER BY id ASC
        LIMIT ?
        """;

    private static final String SQL_NEXT_BATCH = """
        SELECT
            id,
            name,
            description,
            detail,
            images,
            videos,
            is_delete,
            account_id,
            update_time,
            create_time
        FROM product_code
        WHERE id > ?
        ORDER BY id ASC
        LIMIT ?
        """;

    public List<ProductCodeDTO> getBatch(
            UUID lastId,
            int batchSize
    ) throws Exception {

        String sql = lastId == null
                ? SQL_FIRST_BATCH
                : SQL_NEXT_BATCH;

        List<ProductCodeDTO> productCodes = new ArrayList<>();

        try (
                Connection connection =
                        PostgresqlConfig.getDataSource().getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            if (lastId == null) {
                statement.setInt(1, batchSize);
            } else {
                statement.setObject(1, lastId);
                statement.setInt(2, batchSize);
            }

            try (ResultSet rs = statement.executeQuery()) {

                while (rs.next()) {

                    ProductCodeDTO productCode = new ProductCodeDTO(
                            rs.getObject("id", UUID.class),

                            rs.getString("name"),
                            rs.getString("description"),
                            rs.getString("detail"),

                            readJsonList(
                                    rs.getString("images"),
                                    new TypeReference<List<ImageDTO>>() {}
                            ),

                            readJsonList(
                                    rs.getString("videos"),
                                    new TypeReference<List<VideoDTO>>() {}
                            ),

                            rs.getBoolean("is_delete"),

                            rs.getObject("account_id", UUID.class),

                            rs.getObject(
                                    "update_time",
                                    java.time.OffsetDateTime.class
                            ),

                            rs.getObject(
                                    "create_time",
                                    java.time.OffsetDateTime.class
                            )
                    );

                    productCodes.add(productCode);
                }
            }
        }

        return productCodes;
    }

    private static <T> List<T> readJsonList(
            String json,
            TypeReference<List<T>> typeReference
    ) throws Exception {

        if (json == null || json.isBlank()) {
            return List.of();
        }

        return objectMapper.readValue(json, typeReference);
    }
}
