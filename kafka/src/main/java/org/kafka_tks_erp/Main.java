
package org.kafka_tks_erp;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.services.outbox.OutboxApplication;
import org.kafka_tks_erp.services.product.ProductConsumer;
import org.kafka_tks_erp.services.shop.ShopConsumer;

public class Main {

    public static void main(String[] args) {

        PostgresqlConfig.init();

        OutboxApplication outbox = new OutboxApplication();

        ProductConsumer productConsumer = new ProductConsumer();
        ShopConsumer shopConsumer = new ShopConsumer();

        Thread productThread = new Thread(
                productConsumer,
                "product-consumer"
        );

        Thread shopThread = new Thread(
                shopConsumer,
                "shop-consumer"
        );

        try {

            outbox.start();

            productThread.start();

            shopThread.start();

        } catch (Exception e) {

            productThread.interrupt();
            shopThread.interrupt();

            outbox.stop();

            PostgresqlConfig.close();

            throw e;
        }

        Runtime.getRuntime().addShutdownHook(
                new Thread(() -> {

                    System.out.println("Shutting down application...");

                    productThread.interrupt();
                    shopThread.interrupt();

                    outbox.stop();

                    PostgresqlConfig.close();

                    try {
                        productThread.join(5000);
                        shopThread.join(5000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }

                    System.out.println("Application stopped.");

                })
        );
    }
}
