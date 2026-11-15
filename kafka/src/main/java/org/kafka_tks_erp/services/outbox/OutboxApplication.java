
package org.kafka_tks_erp.services.outbox;

import org.kafka_tks_erp.config.KafkaConfig;
import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.publisher.KafkaMessagePublisher;
import org.kafka_tks_erp.core.ManagedService;

import org.apache.kafka.clients.producer.KafkaProducer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class OutboxApplication implements ManagedService {

    private static final Logger logger =
            LoggerFactory.getLogger(OutboxApplication.class);

    private ExecutorService executor;

    private OutboxWorker worker;

    private KafkaProducer<String, String> producer;

    @Override
    public String getName() {
        return "OUTBOX";
    }

    @Override
    public synchronized void start() {

        if (executor != null && !executor.isShutdown()) {
            return;
        }

        logger.info("Starting Outbox service");

        try {

            // 1. PostgreSQL shared connection pool
            PostgresqlConfig.init();

            // 2. Kafka Producer
            producer = KafkaConfig.createProducer("outbox-worker-1");

            // 3. Repository
            OutboxRepository repository =
                    new OutboxRepository();

            // 4. Kafka Publisher
            KafkaMessagePublisher kafkaPublisher =
                    new KafkaMessagePublisher(producer);

            // 5. Worker ID
            String workerId =
                    UUID.randomUUID().toString();

            // 6. Outbox Publisher
            OutboxPublisher outboxPublisher =
                    new OutboxPublisher(
                            repository,
                            kafkaPublisher,
                            workerId
                    );

            // 7. Worker
            worker = new OutboxWorker(
                    outboxPublisher,
                    repository
            );

            // 8. Executor
            executor = Executors.newSingleThreadExecutor(r -> {

                Thread thread = new Thread(
                        r,
                        "outbox-worker-" + workerId
                );

                thread.setDaemon(false);

                return thread;
            });

            executor.submit(worker);

            logger.info(
                    "Outbox service started. Worker ID: {}",
                    workerId
            );

        } catch (Exception e) {

            logger.error(
                    "Cannot start Outbox service",
                    e
            );

            stop();

            throw new RuntimeException(
                    "Outbox service startup failed",
                    e
            );
        }
    }

    @Override
    public synchronized void stop() {

        logger.info("Stopping Outbox service");

        if (worker != null) {
            worker.shutdown();
            worker = null;
        }

        if (executor != null) {

            executor.shutdown();

            try {

                if (!executor.awaitTermination(
                        70,
                        TimeUnit.SECONDS
                )) {
                    executor.shutdownNow();
                }

            } catch (InterruptedException e) {

                executor.shutdownNow();

                Thread.currentThread().interrupt();
            }

            executor = null;
        }

        if (producer != null) {

            producer.close();

            producer = null;
        }

        // Không đóng PostgreSQL tại đây.
        // PostgreSQL được quản lý bởi Application.

        logger.info("Outbox service stopped");
    }
}
