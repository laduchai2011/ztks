
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

    public DeleteDepotOfDeletedShop() {
        this.depotRepository = new DepotRepository();
        this.deleteDepotService = new DeleteDepotService();
    }

    public void execute() {

        DepotCursor cursor = null;

        while (!Thread.currentThread().isInterrupted()) {

            // Lấy từng batch Depot theo cursor
            CursorResponse<DepotDTO, DepotCursor> response =
                    depotRepository.getDepotsOfDeletedShops(
                            BATCH_SIZE,
                            cursor
                    );
            System.out.println(
                    response
            );

            List<DepotDTO> depots = response.items();

            // Không còn dữ liệu
            if (depots.isEmpty()) {
                break;
            }

            // =====================================
            // XỬ LÝ XÓA DEPOT
            // =====================================

            for (DepotDTO depot : depots) {

                // Kiểm tra tín hiệu dừng luồng
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

                // Lấy account_id từ depot_id
                UUID account_id =
                        depotRepository.getAccountIdByDepotId(
                                depot_id
                        );

                if (account_id == null) {
                    throw new RuntimeException(
                            "Account ID not found for depot: " + depot_id
                    );
                }

                // Gửi yêu cầu xóa sang Node.js
                deleteDepotService.deleteDepot(
                        depot_id,
                        account_id
                );
            }

            // Cập nhật cursor sau khi batch xử lý thành công
            cursor = response.nextCursor();

            // Không còn trang tiếp theo
            if (!response.hasNext()) {
                break;
            }
        }

        System.out.println(
                "DeleteDepotOfDeletedShop stopped."
        );
    }
}
