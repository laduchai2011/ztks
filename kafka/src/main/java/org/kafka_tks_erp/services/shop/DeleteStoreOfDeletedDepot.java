
package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.StoreDTO;
import org.kafka_tks_erp.dto.shop.StoreCursor;

import java.util.List;
import java.util.UUID;

public class DeleteStoreOfDeletedDepot {

    private final StoreRepository storeRepository;
    private final DeleteStoreService deleteStoreService;

    private static final int BATCH_SIZE = 500;
    private static final long RESTART_INTERVAL = 10_000;

    public DeleteStoreOfDeletedDepot() {
        this.storeRepository = new StoreRepository();
        this.deleteStoreService = new DeleteStoreService();
    }

    public void execute() {

        while (!Thread.currentThread().isInterrupted()) {

            StoreCursor cursor = null;

            try {

                boolean hasData = true;

                while (
                        hasData &&
                                !Thread.currentThread().isInterrupted()
                ) {

                    CursorResponse<StoreDTO, StoreCursor> response =
                            storeRepository.getStoresOfDeletedDepots(
                                    BATCH_SIZE,
                                    cursor
                            );

                    List<StoreDTO> stores = response.items();

                    if (stores.isEmpty()) {
                        break;
                    }

                    for (StoreDTO store : stores) {

                        if (Thread.currentThread().isInterrupted()) {
                            System.out.println(
                                    "DeleteStoreOfDeletedDepot interrupted."
                            );
                            return;
                        }

                        UUID store_id = store.id();

                        System.out.println(
                                "Processing store: " + store_id
                        );

                        UUID account_id =
                                storeRepository.getAccountIdByStoreId(
                                        store_id
                                );

                        if (account_id == null) {
                            throw new RuntimeException(
                                    "Account ID not found for store: "
                                            + store_id
                            );
                        }

                        deleteStoreService.deleteStore(
                                store_id,
                                account_id
                        );
                    }

                    cursor = response.nextCursor();
                    hasData = response.hasNext();
                }

                System.out.println(
                        "No more stores. Restarting after 10 seconds..."
                );

                Thread.sleep(RESTART_INTERVAL);

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();

                System.out.println(
                        "DeleteStoreOfDeletedDepot interrupted."
                );

                return;

            } catch (Exception e) {

                System.err.println(
                        "DeleteStoreOfDeletedDepot error: "
                                + e.getMessage()
                );

                e.printStackTrace();

                try {
                    Thread.sleep(RESTART_INTERVAL);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }

        System.out.println(
                "DeleteStoreOfDeletedDepot stopped."
        );
    }
}
