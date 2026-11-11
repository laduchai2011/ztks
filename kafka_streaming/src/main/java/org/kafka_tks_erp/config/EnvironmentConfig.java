
package org.kafka_tks_erp.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvironmentConfig {

    private static final String APP_ENV =
            System.getenv().getOrDefault("APP_ENV", "development");

    private static final Dotenv dotenv = Dotenv.configure()
            .filename(
                    APP_ENV.equals("production")
                            ? ".env.production"
                            : ".env.dev"
            )
            .ignoreIfMissing()
            .load();

    private EnvironmentConfig() {
        // Prevent object initialization
    }

    public static String getEnv(String key) {

        // Ưu tiên biến môi trường của hệ điều hành / Docker
        String value = System.getenv(key);

        // Nếu không có thì lấy từ file .env
        if (value == null || value.isBlank()) {
            value = dotenv.get(key);
        }

        // Kiểm tra biến môi trường
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(
                    "Missing environment variable: " + key
            );
        }

        return value;
    }

    public static String getAppEnv() {
        return APP_ENV;
    }
}
