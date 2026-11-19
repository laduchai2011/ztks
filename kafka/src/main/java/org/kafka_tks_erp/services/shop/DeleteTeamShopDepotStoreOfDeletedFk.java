package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.TeamShopDepotStoreCursor;
import org.kafka_tks_erp.dto.shop.TeamShopDepotStoreDTO;

import java.util.List;

public class DeleteTeamShopDepotStoreOfDeletedFk implements Runnable {

    private static final int BATCH_SIZE = 500;
    private static final long WAIT_TIME_MS = 10_000;

    private final TeamShopDepotStoreRepository repository;

    public DeleteTeamShopDepotStoreOfDeletedFk() {
        this.repository = new TeamShopDepotStoreRepository();
    }

    @Override
    public void run() {

        while (!Thread.currentThread().isInterrupted()) {

            try {

                execute();

                // Chờ 10 giây sau khi xử lý hết dữ liệu
                Thread.sleep(WAIT_TIME_MS);

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();
                break;

            } catch (Exception e) {

                System.err.println(
                        "DeleteTeamShopDepotStoreOfDeletedFk error: "
                                + e.getMessage()
                );

                e.printStackTrace();

                try {
                    Thread.sleep(WAIT_TIME_MS);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }

    private void execute() {

        TeamShopDepotStoreCursor cursor = null;

        while (!Thread.currentThread().isInterrupted()) {

            CursorResponse<
                    TeamShopDepotStoreDTO,
                    TeamShopDepotStoreCursor
                    > response =
                    repository.getTeamShopDepotStoresOfDeletedParents(
                            BATCH_SIZE,
                            cursor
                    );

            List<TeamShopDepotStoreDTO> items = response.items();

            if (items.isEmpty()) {
                break;
            }

            for (TeamShopDepotStoreDTO item : items) {

                if (Thread.currentThread().isInterrupted()) {
                    return;
                }

                repository.softDeleteTeamShopDepotStore(item.id());
            }

            cursor = response.nextCursor();

            if (!response.hasNext()) {
                break;
            }
        }
    }
}
