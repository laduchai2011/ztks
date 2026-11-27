
package org.kafka_tks_erp.elastic.product;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import co.elastic.clients.elasticsearch.core.BulkResponse;

import org.kafka_tks_erp.config.ElasticsearchConfig;
import org.kafka_tks_erp.config.EnvironmentConfig;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ElasticProductCodeService {

    private static final String prefix =
            EnvironmentConfig.getEnv("PREFIX");

    private static final String INDEX = "product_code" + prefix;

    private final ElasticsearchClient client;

    public ElasticProductCodeService() {
        this.client = ElasticsearchConfig.getClient();
    }

    // ==========================================
    // DOCUMENT MODEL
    // ==========================================

    public static class ProductCodeDocument {

        public String id;
        public String account_id;
        public String search_content;
        public Boolean is_delete;

        public ProductCodeDocument(
                String id,
                String account_id,
                String search_content,
                Boolean is_delete
        ) {
            this.id = id;
            this.account_id = account_id;
            this.search_content = search_content;
            this.is_delete = is_delete;
        }
    }

    private Map<String, Object> toDocument(
            ProductCodeDocument productCode
    ) {

        Map<String, Object> document = new HashMap<>();

        document.put("account_id", productCode.account_id);
        document.put("search_content", productCode.search_content);

        document.put(
                "is_delete",
                productCode.is_delete != null
                        ? productCode.is_delete
                        : false
        );

        return document;
    }

    // ==========================================
    // CREATE
    // ==========================================

    public IndexResponse create(
            String id,
            String account_id,
            String search_content,
            Boolean is_delete
    ) throws Exception {

        ProductCodeDocument productCode =
                new ProductCodeDocument(
                        id,
                        account_id,
                        search_content,
                        is_delete
                );

        return client.index(i -> i
                .index(INDEX)
                .id(id)
                .document(toDocument(productCode))
        );
    }

    // ==========================================
    // CREATE BATCH
    // ==========================================

    public BulkResponse createBatch(
            List<ProductCodeDocument> productCodes
    ) throws Exception {

        if (productCodes == null || productCodes.isEmpty()) {
            throw new IllegalArgumentException(
                    "ProductCodes list cannot be empty"
            );
        }

        return client.bulk(b -> {

            b.index(INDEX);

            for (ProductCodeDocument productCode : productCodes) {

                if (productCode == null || productCode.id == null) {
                    throw new IllegalArgumentException(
                            "ProductCode and productCode id cannot be null"
                    );
                }

                b.operations(op -> op
                        .index(idx -> idx
                                .id(productCode.id)
                                .document(toDocument(productCode))
                        )
                );
            }

            return b;
        });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    public UpdateResponse<Map> update(
            String id,
            String account_id,
            String search_content,
            Boolean is_delete
    ) throws Exception {

        Map<String, Object> document = new HashMap<>();

        if (account_id != null) {
            document.put("account_id", account_id);
        }

        if (search_content != null) {
            document.put("search_content", search_content);
        }

        if (is_delete != null) {
            document.put("is_delete", is_delete);
        }

        if (document.isEmpty()) {
            throw new IllegalArgumentException(
                    "No fields to update"
            );
        }

        return client.update(u -> u
                        .index(INDEX)
                        .id(id)
                        .doc(document),
                Map.class
        );
    }

    // ==========================================
    // SOFT DELETE
    // ==========================================

    public UpdateResponse<Map> delete(String id) throws Exception {

        return client.update(u -> u
                        .index(INDEX)
                        .id(id)
                        .doc(Map.of("is_delete", true)),
                Map.class
        );
    }

    // ==========================================
    // RESTORE
    // ==========================================

    public UpdateResponse<Map> restore(String id) throws Exception {

        return client.update(u -> u
                        .index(INDEX)
                        .id(id)
                        .doc(Map.of("is_delete", false)),
                Map.class
        );
    }
}
