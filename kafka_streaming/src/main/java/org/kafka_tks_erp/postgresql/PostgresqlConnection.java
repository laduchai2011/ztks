package org.kafka_tks_erp.postgresql;

import org.kafka_tks_erp.config.PostgresqlConfig;

import java.sql.Connection;
import java.sql.SQLException;

public class PostgresqlConnection {

    public static Connection getConnection() throws SQLException {
        return PostgresqlConfig.getDataSource().getConnection();
    }
}
