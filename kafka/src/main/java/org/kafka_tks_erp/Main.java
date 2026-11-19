
package org.kafka_tks_erp;

import org.kafka_tks_erp.config.PostgresqlConfig;
import org.kafka_tks_erp.services.outbox.OutboxApplication;
import org.kafka_tks_erp.services.product.ProductConsumer;
import org.kafka_tks_erp.services.shop.DeleteStoreOfDeletedDepot;
import org.kafka_tks_erp.services.shop.ShopConsumer;
import org.kafka_tks_erp.services.shop.DeleteDepotOfDeletedShop;
import org.kafka_tks_erp.services.shop.DeleteTeamShopOfDeletedFk;
import org.kafka_tks_erp.services.shop.DeleteTeamShopDepotOfDeletedFk;
import org.kafka_tks_erp.services.shop.DeleteTeamShopDepotStoreOfDeletedFk;

public class Main {

    public static void main(String[] args) {

        PostgresqlConfig.init();

        OutboxApplication outbox = new OutboxApplication();

        ProductConsumer productConsumer = new ProductConsumer();
        ShopConsumer shopConsumer = new ShopConsumer();

        DeleteDepotOfDeletedShop deleteDepotOfDeletedShop =
                new DeleteDepotOfDeletedShop();

        DeleteStoreOfDeletedDepot deleteStoreOfDeletedDepot =
                new DeleteStoreOfDeletedDepot();

        DeleteTeamShopOfDeletedFk deleteTeamShopOfDeletedFk =
                new DeleteTeamShopOfDeletedFk();

        DeleteTeamShopDepotOfDeletedFk deleteTeamShopDepotOfDeletedFk =
                new DeleteTeamShopDepotOfDeletedFk();

        DeleteTeamShopDepotStoreOfDeletedFk deleteTeamShopDepotStoreOfDeletedFk =
                new DeleteTeamShopDepotStoreOfDeletedFk();

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

        Thread deleteStoreOfDeletedDepotThread = new Thread(
                deleteStoreOfDeletedDepot::execute,
                "delete-store-of-deleted-depot"
        );

        Thread deleteTeamShopOfDeletedFkThread = new Thread(
                deleteTeamShopOfDeletedFk,
                "delete-team-shop-of-deleted-fk"
        );

        Thread deleteTeamShopDepotOfDeletedFkThread = new Thread(
                deleteTeamShopDepotOfDeletedFk,
                "delete-team-shop-depot-of-deleted-fk"
        );

        Thread deleteTeamShopDepotStoreOfDeletedFkThread = new Thread(
                deleteTeamShopDepotStoreOfDeletedFk,
                "delete-team-shop-depot-store-of-deleted-fk"
        );

        try {

            outbox.start();
            productThread.start();
            shopThread.start();
            deleteDepotOfDeletedShopThread.start();
            deleteStoreOfDeletedDepotThread.start();
            deleteTeamShopOfDeletedFkThread.start();
            deleteTeamShopDepotOfDeletedFkThread.start();
            deleteTeamShopDepotStoreOfDeletedFkThread.start();

        } catch (Exception e) {

            outbox.stop();
            productThread.interrupt();
            shopThread.interrupt();
            deleteDepotOfDeletedShopThread.interrupt();
            deleteStoreOfDeletedDepotThread.interrupt();
            deleteTeamShopOfDeletedFkThread.interrupt();
            deleteTeamShopDepotOfDeletedFkThread.interrupt();
            deleteTeamShopDepotStoreOfDeletedFkThread.interrupt();

            PostgresqlConfig.close();

            throw e;
        }

        Runtime.getRuntime().addShutdownHook(
                new Thread(() -> {

                    System.out.println("Shutting down application...");
                    outbox.stop();

                    productThread.interrupt();
                    shopThread.interrupt();
                    deleteDepotOfDeletedShopThread.interrupt();
                    deleteStoreOfDeletedDepotThread.interrupt();
                    deleteTeamShopOfDeletedFkThread.interrupt();
                    deleteTeamShopDepotOfDeletedFkThread.interrupt();
                    deleteTeamShopDepotStoreOfDeletedFkThread.interrupt();

                    try {

                        productThread.join(5000);
                        shopThread.join(5000);
                        deleteDepotOfDeletedShopThread.join(5000);
                        deleteStoreOfDeletedDepotThread.join(5000);
                        deleteTeamShopOfDeletedFkThread.join(5000);
                        deleteTeamShopDepotOfDeletedFkThread.join(5000);
                        deleteTeamShopDepotStoreOfDeletedFkThread.join(5000);

                    } catch (InterruptedException e) {

                        Thread.currentThread().interrupt();
                    }

                    PostgresqlConfig.close();

                    System.out.println("Application stopped.");

                })
        );
    }
}
