package org.kafka_tks_erp.services.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OutboxWorker implements Runnable {

    private static final Logger logger =
            LoggerFactory.getLogger(OutboxWorker.class);

    private final OutboxPublisher publisher;

    private final OutboxRepository repository;

    private volatile boolean running = true;

    private static final long IDLE_INTERVAL_MS = 500;

    private static final long ERROR_INTERVAL_MS = 2000;

    private static final long MAINTENANCE_INTERVAL_MS = 30000;

    private long lastMaintenanceTime = 0;

    public OutboxWorker(
            OutboxPublisher publisher,
            OutboxRepository repository
    ) {

        this.publisher = publisher;

        this.repository = repository;
    }

    @Override
    public void run() {

        logger.info("OutboxWorker started");

        while (
                running
                        && !Thread.currentThread().isInterrupted()
        ) {

            try {

                // 1. Đọc và publish event
                int processed = publisher.publishBatch();

                // 2. Kiểm tra event hết lượt retry
                runMaintenance();

                // 3. Không có event thì nghỉ
                if (processed == 0) {

                    Thread.sleep(IDLE_INTERVAL_MS);
                }

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();

                break;

            } catch (Exception e) {

                logger.error(
                        "OutboxWorker encountered an error",
                        e
                );

                try {

                    Thread.sleep(ERROR_INTERVAL_MS);

                } catch (InterruptedException interruptedException) {

                    Thread.currentThread().interrupt();

                    break;
                }
            }
        }

        logger.info("OutboxWorker stopped");
    }

    /**
     * Chạy các tác vụ bảo trì.
     */
    private void runMaintenance() throws Exception {

        long now = System.currentTimeMillis();

        if (
                now - lastMaintenanceTime
                        < MAINTENANCE_INTERVAL_MS
        ) {
            return;
        }

        lastMaintenanceTime = now;

        int failed = repository.failExhaustedEvents();

        if (failed > 0) {

            logger.warn(
                    "{} events moved to failed",
                    failed
            );
        }
    }

    public void shutdown() {

        running = false;
    }
}