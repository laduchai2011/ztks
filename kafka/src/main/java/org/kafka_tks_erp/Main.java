package org.kafka_tks_erp;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.services.outbox.OutboxApplication;
import org.kafka_tks_erp.services.product.ProductConsumer;
import org.kafka_tks_erp.services.product.ProductConsumer;

public class Main {

    public static void main(String[] args) {

        System.out.println("Main Application started");

        PostgresqlConfig.init();

        OutboxApplication outbox =
                new OutboxApplication();

//        ProductStreamApplication productStream =
//                new ProductStreamApplication();
        ProductConsumer  productConsumer = new ProductConsumer();

        try {

            outbox.start();

            productConsumer.run();

//            productStream.start();

        } catch (Exception e) {

//            productStream.stop();
            outbox.stop();

            PostgresqlConfig.close();

            throw e;
        }

        Runtime.getRuntime().addShutdownHook(
                new Thread(() -> {

//                    productStream.stop();

                    outbox.stop();

                    PostgresqlConfig.close();

                })
        );
    }
}