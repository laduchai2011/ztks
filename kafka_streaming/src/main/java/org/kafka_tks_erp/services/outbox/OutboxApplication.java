package org.kafka_tks_erp.services.outbox;

import org.kafka_tks_erp.core.ManagedService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OutboxApplication implements ManagedService {

    private ExecutorService executor;
    private static final Logger logger =
            LoggerFactory.getLogger(OutboxApplication.class);


    @Override
    public String getName() {
        return "OUTBOX";
    }

    @Override
    public void start() {
        logger.info("Outbox service started");

        // Khởi tạo OutboxWorker
        // Đọc dữ liệu từ PostgreSQL
        // Gửi dữ liệu lên Kafka
        executor = Executors.newSingleThreadExecutor();

        executor.submit(() -> {

        });
    }

    @Override
    public void stop() {
        logger.info("Outbox service stopped");

        // Đóng worker
        // Đóng Kafka Producer
        if (executor != null) {
            executor.shutdownNow();
        }
    }
}