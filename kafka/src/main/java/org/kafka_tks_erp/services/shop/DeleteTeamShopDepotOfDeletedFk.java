
package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.TeamShopDepotCursor;
import org.kafka_tks_erp.dto.shop.TeamShopDepotDTO;

import java.util.List;

public class DeleteTeamShopDepotOfDeletedFk implements Runnable {

    private static final int BATCH_SIZE = 500;
    private static final long WAIT_TIME_MS = 10_000;

    private final TeamShopDepotRepository repository;

    public DeleteTeamShopDepotOfDeletedFk() {
        this.repository = new TeamShopDepotRepository();
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
                        "DeleteTeamShopDepotOfDeletedFk error: "
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

        TeamShopDepotCursor cursor = null;

        while (!Thread.currentThread().isInterrupted()) {

            CursorResponse<TeamShopDepotDTO, TeamShopDepotCursor> response =
                    repository.getTeamShopDepotsOfDeletedParents(
                            BATCH_SIZE,
                            cursor
                    );

            List<TeamShopDepotDTO> items = response.items();

            if (items.isEmpty()) {
                break;
            }

            for (TeamShopDepotDTO item : items) {

                if (Thread.currentThread().isInterrupted()) {
                    return;
                }

                repository.softDeleteTeamShopDepot(item.id());
            }

            cursor = response.nextCursor();

            if (!response.hasNext()) {
                break;
            }
        }
    }
}
