
package org.kafka_tks_erp.services.product;

import org.kafka_tks_erp.dto.product.ProductCodeDTO;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

public class ProductCodeBatchService {

    private final ProductCodeRepository productCodeRepository;
    private final ProductCodeElasticRepository productCodeElasticRepository;

    public ProductCodeBatchService() {
        this.productCodeRepository = new ProductCodeRepository();
        this.productCodeElasticRepository = new ProductCodeElasticRepository();
    }

    @FunctionalInterface
    public interface BatchProcessor {
        void process(List<ProductCodeDTO> productCodes) throws Exception;
    }

    public long readAll(
            int batchSize,
            BatchProcessor processor
    ) throws Exception {

        UUID lastId = null;
        long totalProcessed = 0;

        while (true) {

            List<ProductCodeDTO> productCodes =
                    productCodeRepository.getBatch(lastId, batchSize);

            if (productCodes.isEmpty()) {
                break;
            }

            processor.process(productCodes);

            lastId = productCodes.get(
                    productCodes.size() - 1
            ).id();

            totalProcessed += productCodes.size();

            if (productCodes.size() < batchSize) {
                break;
            }
        }

        return totalProcessed;
    }

    public long writeToElastic(int batchSize) throws Exception {

        return readAll(
                batchSize,
                productCodeElasticRepository::bulkIndex
        );
    }

    public long writeToClickHouse(int batchSize) throws Exception {

        // TODO: Implement PostgreSQL -> ClickHouse

        return 0;
    }

    /**
     * Chạy đồng bộ PostgreSQL sang Elasticsearch và ClickHouse
     * trên 2 luồng riêng biệt.
     */
    public void syncAll(int batchSize) throws Exception {

        ExecutorService executor = Executors.newFixedThreadPool(2);

        try {

            CompletableFuture<Long> elasticFuture =
                    CompletableFuture.supplyAsync(() -> {

                        try {

                            return writeToElastic(batchSize);

                        } catch (Exception e) {
                            throw new CompletionException(e);
                        }

                    }, executor);

            CompletableFuture<Long> clickHouseFuture =
                    CompletableFuture.supplyAsync(() -> {

                        try {

                            return writeToClickHouse(batchSize);

                        } catch (Exception e) {
                            throw new CompletionException(e);
                        }

                    }, executor);

            // Chờ cả 2 luồng hoàn thành
            CompletableFuture.allOf(
                    elasticFuture,
                    clickHouseFuture
            ).join();

            // Lấy kết quả
            long elasticTotal = elasticFuture.join();
            long clickHouseTotal = clickHouseFuture.join();

            System.out.println("ProductCode Elasticsearch: " + elasticTotal);
            System.out.println("ProductCode ClickHouse: " + clickHouseTotal);

        } catch (CompletionException e) {

            Throwable cause = e.getCause();

            if (cause instanceof Exception exception) {
                throw exception;
            }

            throw e;

        } finally {
            executor.shutdown();
        }
    }
}
