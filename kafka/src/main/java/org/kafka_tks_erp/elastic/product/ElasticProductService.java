
package org.kafka_tks_erp.elastic.product;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import co.elastic.clients.elasticsearch.core.BulkResponse;
//import co.elastic.clients.elasticsearch.core.bulk.BulkResponseItem;

import org.kafka_tks_erp.config.ElasticsearchConfig;
import org.kafka_tks_erp.config.EnvironmentConfig;

//import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ElasticProductService {

    private static final String prefix =
            EnvironmentConfig.getEnv("PREFIX");

    private static final String INDEX = "product" + prefix;

    private final ElasticsearchClient client;

    public ElasticProductService() {
        this.client = ElasticsearchConfig.getClient();
    }

    // ==========================================
    // DOCUMENT MODEL
    // ==========================================

    public static class ProductDocument {

        public String id;
        public String account_id;
        public String search_content;
        public Boolean is_delete;

        public ProductDocument(
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

    private Map<String, Object> toDocument(ProductDocument product) {

        Map<String, Object> document = new HashMap<>();

        document.put("account_id", product.account_id);
        document.put("search_content", product.search_content);
        document.put(
                "is_delete",
                product.is_delete != null ? product.is_delete : false
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

        ProductDocument product = new ProductDocument(
                id, account_id, search_content, is_delete
        );

        return client.index(i -> i
                .index(INDEX)
                .id(id)
                .document(toDocument(product))
        );
    }

    // ==========================================
    // CREATE BATCH
    // ==========================================

    public BulkResponse createBatch(
            List<ProductDocument> products
    ) throws Exception {

        if (products == null || products.isEmpty()) {
            throw new IllegalArgumentException(
                    "Products list cannot be empty"
            );
        }

        return client.bulk(b -> {

            b.index(INDEX);

            for (ProductDocument product : products) {

                if (product == null || product.id == null) {
                    throw new IllegalArgumentException(
                            "Product and product id cannot be null"
                    );
                }

                b.operations(op -> op
                        .index(idx -> idx
                                .id(product.id)
                                .document(toDocument(product))
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
