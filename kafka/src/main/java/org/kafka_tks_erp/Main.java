
package org.kafka_tks_erp;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.services.outbox.OutboxApplication;
import org.kafka_tks_erp.services.product.ProductConsumer;
import org.kafka_tks_erp.services.shop.ShopConsumer;
import org.kafka_tks_erp.services.shop.DeleteDepotOfDeletedShop;

public class Main {

    public static void main(String[] args) {

        PostgresqlConfig.init();

        OutboxApplication outbox = new OutboxApplication();

        ProductConsumer productConsumer = new ProductConsumer();
        ShopConsumer shopConsumer = new ShopConsumer();

        DeleteDepotOfDeletedShop deleteDepotOfDeletedShop =
                new DeleteDepotOfDeletedShop();

        Thread productThread = new Thread(
                productConsumer,
                "product-consumer"
        );

        Thread shopThread = new Thread(
                shopConsumer,
                "shop-consumer"
        );

        Thread deleteDepotOfDeletedShopThread = new Thread(
                deleteDepotOfDeletedShop::execute,
                "delete-depot-of-deleted-shop"
        );

        try {

            outbox.start();

            productThread.start();

            shopThread.start();

            deleteDepotOfDeletedShopThread.start();

        } catch (Exception e) {

            productThread.interrupt();
            shopThread.interrupt();
            deleteDepotOfDeletedShopThread.interrupt();

            outbox.stop();

            PostgresqlConfig.close();

            throw e;
        }

        Runtime.getRuntime().addShutdownHook(
                new Thread(() -> {

                    System.out.println("Shutting down application...");

                    productThread.interrupt();
                    shopThread.interrupt();
                    deleteDepotOfDeletedShopThread.interrupt();

                    outbox.stop();

                    try {

                        productThread.join(5000);
                        shopThread.join(5000);
                        deleteDepotOfDeletedShopThread.join(5000);

                    } catch (InterruptedException e) {

                        Thread.currentThread().interrupt();
                    }

                    PostgresqlConfig.close();

                    System.out.println("Application stopped.");

                })
        );
    }
}
