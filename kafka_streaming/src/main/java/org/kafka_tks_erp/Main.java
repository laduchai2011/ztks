package org.kafka_tks_erp;

import org.kafka_tks_erp.core.ServiceManager;
import org.kafka_tks_erp.services.outbox.OutboxApplication;
//import org.kafka_tks_erp.services.inventory.InventoryApplication;
//import org.kafka_tks_erp.services.analytics.AnalyticsApplication;

public class Main {

    public static void main(String[] args) throws Exception {

        ServiceManager manager = new ServiceManager();

        // Register services
        if (Boolean.parseBoolean(
                System.getenv("OUTBOX_ENABLED"))) {
            manager.register(new OutboxApplication());
        }

//        if (Boolean.parseBoolean(
//                System.getenv("INVENTORY_ENABLED"))) {
//            manager.register(new InventoryApplication());
//        }

//        if (Boolean.parseBoolean(
//                System.getenv("ANALYTICS_ENABLED"))) {
//            manager.register(new AnalyticsApplication());
//        }

        // Shutdown hook
        Runtime.getRuntime().addShutdownHook(
                new Thread(manager::stopAll)
        );

        // Start services
        manager.startAll();
    }
}