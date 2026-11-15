package org.kafka_tks_erp.services.product;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import co.elastic.clients.elasticsearch.core.DeleteResponse;

import org.kafka_tks_erp.config.ElasticsearchConfig;

import java.util.HashMap;
import java.util.Map;

public class ElasticProductCodeService {

    private static final String INDEX = "product_code";

    private final ElasticsearchClient client;

    public ElasticProductCodeService() {
        this.client = ElasticsearchConfig.getClient();
    }

    // ==========================================
    // CREATE
    // ==========================================

    public IndexResponse create(
            String id,
            String accountId,
            String searchContent
    ) throws Exception {

        Map<String, Object> document = new HashMap<>();

        document.put("account_id", accountId);
        document.put("search_content", searchContent);

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
            String accountId,
            String searchContent
    ) throws Exception {

        Map<String, Object> document = new HashMap<>();

        if (accountId != null) {
            document.put("account_id", accountId);
        }

        if (searchContent != null) {
            document.put("search_content", searchContent);
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