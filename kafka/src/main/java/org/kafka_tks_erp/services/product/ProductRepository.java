package org.kafka_tks_erp.services.product;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.dto.product.ProductDTO;
import org.kafka_tks_erp.dto.product.ImageDTO;
import org.kafka_tks_erp.dto.product.VideoDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ProductRepository {

    private static final ObjectMapper objectMapper =
            new ObjectMapper().registerModule(new JavaTimeModule());

    private static final String SQL_FIRST_BATCH = """
        SELECT
            id,
            name,
            description,
            detail,
            quantity_in,
            quantity_out,
            images,
            videos,
            is_compelled_price,
            unit_price,
            is_lock,
            is_delete,
            store_id,
            product_code_id,
            account_id,
            update_time,
            create_time
        FROM product
        ORDER BY id ASC
        LIMIT ?
        """;

    private static final String SQL_NEXT_BATCH = """
        SELECT
            id,
            name,
            description,
            detail,
            quantity_in,
            quantity_out,
            images,
            videos,
            is_compelled_price,
            unit_price,
            is_lock,
            is_delete,
            store_id,
            product_code_id,
            account_id,
            update_time,
            create_time
        FROM product
        WHERE id > ?
        ORDER BY id ASC
        LIMIT ?
        """;

    public List<ProductDTO> getBatch(
            UUID lastId,
            int batchSize
    ) throws Exception {

        String sql = lastId == null
                ? SQL_FIRST_BATCH
                : SQL_NEXT_BATCH;

        List<ProductDTO> products = new ArrayList<>();

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

                    ProductDTO product = new ProductDTO(
                            rs.getObject("id", UUID.class),
                            rs.getString("name"),
                            rs.getString("description"),
                            rs.getString("detail"),

                            rs.getInt("quantity_in"),
                            rs.getInt("quantity_out"),

                            readJsonList(
                                    rs.getString("images"),
                                    new TypeReference<List<ImageDTO>>() {}
                            ),

                            readJsonList(
                                    rs.getString("videos"),
                                    new TypeReference<List<VideoDTO>>() {}
                            ),

                            rs.getBoolean("is_compelled_price"),
                            rs.getBigDecimal("unit_price"),

                            rs.getBoolean("is_lock"),
                            rs.getBoolean("is_delete"),

                            rs.getObject("store_id", UUID.class),
                            rs.getObject("product_code_id", UUID.class),
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

                    products.add(product);
                }
            }
        }

        return products;
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
