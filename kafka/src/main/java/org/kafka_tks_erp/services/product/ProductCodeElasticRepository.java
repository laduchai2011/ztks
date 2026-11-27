
package org.kafka_tks_erp.services.product;

import org.kafka_tks_erp.dto.product.ProductCodeDTO;
import org.kafka_tks_erp.elastic.product.ElasticProductCodeService;

import co.elastic.clients.elasticsearch.core.BulkResponse;

import java.util.ArrayList;
import java.util.List;

public class ProductCodeElasticRepository {

    private final ElasticProductCodeService elasticProductCodeService;

    public ProductCodeElasticRepository() {
        this.elasticProductCodeService = new ElasticProductCodeService();
    }

    public void bulkIndex(List<ProductCodeDTO> productCodes)
            throws Exception {

        if (productCodes == null || productCodes.isEmpty()) {
            return;
        }

        List<ElasticProductCodeService.ProductCodeDocument> documents =
                new ArrayList<>();

        for (ProductCodeDTO productCode : productCodes) {

            if (productCode == null || productCode.id() == null) {
                throw new IllegalArgumentException(
                        "ProductCode and productCode id cannot be null"
                );
            }

            if (productCode.account_id() == null) {
                throw new IllegalArgumentException(
                        "ProductCode account_id cannot be null: "
                                + productCode.id()
                );
            }

            documents.add(
                    new ElasticProductCodeService.ProductCodeDocument(
                            productCode.id().toString(),
                            productCode.account_id().toString(),
                            productCode.name() + " " + productCode.description(),
                            productCode.is_delete()
                    )
            );
        }

        BulkResponse response =
                elasticProductCodeService.createBatch(documents);

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
                    "Elasticsearch ProductCode Bulk Error:\n" + errors
            );
        }

        System.out.println(
                "Elasticsearch ProductCode indexed: "
                        + productCodes.size()
        );
    }
}
