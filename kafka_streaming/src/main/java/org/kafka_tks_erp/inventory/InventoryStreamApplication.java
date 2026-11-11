package org.kafka_tks_erp.inventory;

import org.kafka_tks_erp.core.ManagedService;

public class InventoryStreamApplication implements ManagedService {

    @Override
    public String getName() {
        return "InventoryStreamApplication";
    }

    @Override
    public void start() {
        System.out.println("Inventory Service started");

        // Khởi tạo Kafka Streams
        // Đọc order-paid-events
        // Xử lý tồn kho
    }

    @Override
    public void stop() {
        System.out.println("Inventory service stopped");

        // Đóng Kafka Streams
    }

//    @Override
//    public void close() {
//        System.out.println("Inventory Service closed");
//    }
}
