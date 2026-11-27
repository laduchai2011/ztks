package org.kafka_tks_erp.services.product;

import org.kafka_tks_erp.dto.product.ProductDTO;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

public class ProductBatchService {

    private final ProductRepository productRepository;
    private final ProductElasticRepository productElasticRepository;

    public ProductBatchService() {
        this.productRepository = new ProductRepository();
        this.productElasticRepository = new ProductElasticRepository();
    }

    @FunctionalInterface
    public interface BatchProcessor {
        void process(List<ProductDTO> products) throws Exception;
    }

    public long readAll(
            int batchSize,
            BatchProcessor processor
    ) throws Exception {

        UUID lastId = null;
        long totalProcessed = 0;

        while (true) {

            List<ProductDTO> products =
                    productRepository.getBatch(lastId, batchSize);

            if (products.isEmpty()) {
                break;
            }

            processor.process(products);

            lastId = products.get(products.size() - 1).id();

            totalProcessed += products.size();

            if (products.size() < batchSize) {
                break;
            }
        }

        return totalProcessed;
    }

    public long writeToElastic(int batchSize) throws Exception {
        return readAll(
                batchSize,
                productElasticRepository::bulkIndex
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

            System.out.println("Elasticsearch: " + elasticTotal);
            System.out.println("ClickHouse: " + clickHouseTotal);

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