package org.kafka_tks_erp.elastic.shop;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import co.elastic.clients.elasticsearch.core.DeleteResponse;

import org.kafka_tks_erp.config.ElasticsearchConfig;
import org.kafka_tks_erp.config.EnvironmentConfig;

import java.util.HashMap;
import java.util.Map;

public class ElasticDepotService {

    private static final String prefix = EnvironmentConfig.getEnv("PREFIX");

    private static final String INDEX = "depot"  + prefix;

    private final ElasticsearchClient client;

    public ElasticDepotService() {
        this.client = ElasticsearchConfig.getClient();
    }

    // ==========================================
    // CREATE
    // ==========================================

    public IndexResponse create(
            String id,
            String shop_id,
            String search_content
    ) throws Exception {

        Map<String, Object> document = new HashMap<>();

        document.put("shop_id", shop_id);
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
            String shop_id,
            String search_content
    ) throws Exception {

        Map<String, Object> document = new HashMap<>();

        if (shop_id != null) {
            document.put("shop_id", shop_id);
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