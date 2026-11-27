
package org.kafka_tks_erp.services.product;

import org.kafka_tks_erp.dto.product.ProductDTO;
import org.kafka_tks_erp.elastic.product.ElasticProductService;

import co.elastic.clients.elasticsearch.core.BulkResponse;

import java.util.ArrayList;
import java.util.List;

public class ProductElasticRepository {

    private final ElasticProductService elasticProductService;

    public ProductElasticRepository() {
        this.elasticProductService = new ElasticProductService();
    }

    public void bulkIndex(List<ProductDTO> products)
            throws Exception {

        if (products == null || products.isEmpty()) {
            return;
        }

        List<ElasticProductService.ProductDocument> documents =
                new ArrayList<>();

        for (ProductDTO product : products) {

            if (product == null || product.id() == null) {
                throw new IllegalArgumentException(
                        "Product and product id cannot be null"
                );
            }

            documents.add(
                    new ElasticProductService.ProductDocument(
                            product.id().toString(),
                            product.account_id().toString(),
                            product.name() + " " + product.description(),
                            product.is_delete()
                    )
            );
        }

        BulkResponse response =
                elasticProductService.createBatch(documents);

        if (response.errors()) {

            StringBuilder errors = new StringBuilder();

            response.items().forEach(item -> {

                if (item.error() != null) {

                    errors.append("ID: ")
                            .append(item.id())
                            .append(" | Error: ")
                            .append(item.error().reason())
                            .append("\n");
                }
            });

            throw new RuntimeException(
                    "Elasticsearch Bulk Error:\n" + errors
            );
        }

        System.out.println(
                "Elasticsearch indexed: " + products.size()
        );
    }
}
