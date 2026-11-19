package org.kafka_tks_erp.url;

import org.kafka_tks_erp.config.EnvironmentConfig;

public class SHOP_URL {
    private static final String BASE_URL = EnvironmentConfig.getEnv("BASE_URL");

    public static final String DELETE_DEPOT =
            BASE_URL +  "/service__shop/mutate/kafka_delete_depot";

    public static final String DELETE_STORE =
            BASE_URL + "/service__shop/mutate/kafka_delete_store";
}
