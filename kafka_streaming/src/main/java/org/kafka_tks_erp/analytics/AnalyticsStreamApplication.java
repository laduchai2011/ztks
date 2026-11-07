package org.kafka_tks_erp.analytics;

import org.kafka_tks_erp.core.ManagedService;

public class AnalyticsStreamApplication
        implements ManagedService {

    @Override
    public void start() {
        System.out.println("Analytics Service started");

        // Khởi tạo Kafka Streams
        // Đọc order-paid-events
        // Xử lý thống kê
    }

    @Override
    public void close() {
        System.out.println("Analytics Service closed");
    }
}
