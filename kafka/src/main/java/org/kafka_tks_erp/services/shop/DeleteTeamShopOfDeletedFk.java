
package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.TeamShopCursor;
import org.kafka_tks_erp.dto.shop.TeamShopDTO;

import java.util.List;

public class DeleteTeamShopOfDeletedFk implements Runnable {

    private static final int BATCH_SIZE = 500;
    private static final long WAIT_TIME_MS = 10_000;

    private final TeamShopRepository teamShopRepository;

    public DeleteTeamShopOfDeletedFk() {
        this.teamShopRepository = new TeamShopRepository();
    }

    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                execute();

                // Đợi 10 giây sau khi xử lý hết dữ liệu
                Thread.sleep(WAIT_TIME_MS);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;

            } catch (Exception e) {
                System.err.println(
                        "DeleteTeamShopOfDeletedFk error: " + e.getMessage()
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
        TeamShopCursor cursor = null;

        while (!Thread.currentThread().isInterrupted()) {

            CursorResponse<TeamShopDTO, TeamShopCursor> response =
                    teamShopRepository.getTeamShopsOfDeletedParents(
                            BATCH_SIZE,
                            cursor
                    );

            List<TeamShopDTO> teamShops = response.items();

            if (teamShops.isEmpty()) {
                break;
            }

            for (TeamShopDTO teamShop : teamShops) {

                if (Thread.currentThread().isInterrupted()) {
                    return;
                }

                teamShopRepository.softDeleteTeamShop(teamShop.id());
            }

            cursor = response.nextCursor();

            if (!response.hasNext()) {
                break;
            }
        }
    }
}
