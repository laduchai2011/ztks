package org.kafka_tks_erp.services.product;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import co.elastic.clients.elasticsearch.core.DeleteResponse;

import org.kafka_tks_erp.config.ElasticsearchConfig;
import org.kafka_tks_erp.config.EnvironmentConfig;

import java.util.HashMap;
import java.util.Map;

public class ElasticProductService {

    private static final String prefix = EnvironmentConfig.getEnv("PREFIX");

    private static final String INDEX = "product"  + prefix;

    private final ElasticsearchClient client;

    public ElasticProductService() {
        this.client = ElasticsearchConfig.getClient();
    }

    // ==========================================
    // CREATE
    // ==========================================

    public IndexResponse create(
            String id,
            String account_id,
            String search_content
    ) throws Exception {

        Map<String, Object> document = new HashMap<>();

        document.put("account_id", account_id);
        document.put("search_content", search_content);

        return client.index(i -> i
                .index(INDEX)
                .id(id)
                .document(document)
        );
    }

    // ==========================================
    // UPDATE
    // ==========================================

    public UpdateResponse<Map> update(
            String id,
            String account_id,
            String search_content
    ) throws Exception {

        Map<String, Object> document = new HashMap<>();

        if (account_id != null) {
            document.put("account_id", account_id);
        }

        if (search_content != null) {
            document.put("search_content", search_content);
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
    // DELETE
    // ==========================================

    public DeleteResponse delete(
            String id
    ) throws Exception {

        return client.delete(d -> d
                .index(INDEX)
                .id(id)
        );
    }
}