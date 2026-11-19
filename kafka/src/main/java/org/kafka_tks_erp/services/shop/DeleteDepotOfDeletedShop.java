
package org.kafka_tks_erp.services.shop;

import org.kafka_tks_erp.dto.shop.CursorResponse;
import org.kafka_tks_erp.dto.shop.DepotDTO;
import org.kafka_tks_erp.dto.shop.DepotCursor;

import java.util.List;
import java.util.UUID;

public class DeleteDepotOfDeletedShop {

    private final DepotRepository depotRepository;
    private final DeleteDepotService deleteDepotService;

    private static final int BATCH_SIZE = 500;
    private static final long RESTART_INTERVAL = 10_000;

    public DeleteDepotOfDeletedShop() {
        this.depotRepository = new DepotRepository();
        this.deleteDepotService = new DeleteDepotService();
    }

    public void execute() {

        while (!Thread.currentThread().isInterrupted()) {

            // Mỗi lần quét mới đều bắt đầu từ đầu
            DepotCursor cursor = null;

            try {
                boolean hasData = true;

                while (
                        hasData &&
                                !Thread.currentThread().isInterrupted()
                ) {

                    CursorResponse<DepotDTO, DepotCursor> response =
                            depotRepository.getDepotsOfDeletedShops(
                                    BATCH_SIZE,
                                    cursor
                            );

                    List<DepotDTO> depots = response.items();

                    // Không còn dữ liệu
                    if (depots.isEmpty()) {
                        break;
                    }

                    for (DepotDTO depot : depots) {

                        if (Thread.currentThread().isInterrupted()) {
                            System.out.println(
                                    "DeleteDepotOfDeletedShop interrupted."
                            );
                            return;
                        }

                        UUID depot_id = depot.id();

                        System.out.println(
                                "Processing depot: " + depot_id
                        );

                        UUID account_id =
                                depotRepository.getAccountIdByDepotId(
                                        depot_id
                                );

                        if (account_id == null) {
                            throw new RuntimeException(
                                    "Account ID not found for depot: "
                                            + depot_id
                            );
                        }

                        deleteDepotService.deleteDepot(
                                depot_id,
                                account_id
                        );
                    }

                    cursor = response.nextCursor();
                    hasData = response.hasNext();
                }

                // Đã quét hết dữ liệu, chờ 10 giây
                System.out.println(
                        "No more depots. Restarting after 10 seconds..."
                );

                Thread.sleep(RESTART_INTERVAL);

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();

                System.out.println(
                        "DeleteDepotOfDeletedShop interrupted."
                );

                return;

            } catch (Exception e) {

                System.err.println(
                        "DeleteDepotOfDeletedShop error: "
                                + e.getMessage()
                );

                e.printStackTrace();

                // Nếu có lỗi, chờ 10 giây rồi thử lại
                try {
                    Thread.sleep(RESTART_INTERVAL);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }

        System.out.println(
                "DeleteDepotOfDeletedShop stopped."
        );
    }
}
