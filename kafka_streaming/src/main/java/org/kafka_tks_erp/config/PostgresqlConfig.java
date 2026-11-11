package org.kafka_tks_erp.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class PostgresqlConfig {

    private static HikariDataSource dataSource;


    public static synchronized HikariDataSource getDataSource() {

        if (dataSource == null || dataSource.isClosed()) {
            HikariConfig config = new HikariConfig();

            String host = EnvironmentConfig.getEnv("POSTGRES_HOST");
            String port = EnvironmentConfig.getEnv("POSTGRES_PORT");
            String database = EnvironmentConfig.getEnv("POSTGRES_DB");

            config.setJdbcUrl(
                    "jdbc:postgresql://" + host + ":" + port + "/" + database
            );

            config.setUsername(EnvironmentConfig.getEnv("POSTGRES_USER"));
            config.setPassword(EnvironmentConfig.getEnv("POSTGRES_PASSWORD"));

            // Connection Pool
            config.setMaximumPoolSize(20);
            config.setMinimumIdle(5);

            config.setConnectionTimeout(10_000);
            config.setIdleTimeout(30_000);
            config.setMaxLifetime(1_800_000);

            config.setPoolName("Kafka-PostgreSQL-Pool");

            dataSource = new HikariDataSource(config);
        }

        return dataSource;
    }

    public static void close() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
