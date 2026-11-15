package org.kafka_tks_erp.postgresql;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class PostgresqlExecutor {

    private final DataSource dataSource;

    public PostgresqlExecutor(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // Chạy function trả về dữ liệu dạng ResultSet
    public ResultSet executeQuery(
            String sql,
            Object... params
    ) throws SQLException {

        Connection connection = dataSource.getConnection();

        try {
            PreparedStatement statement = connection.prepareStatement(sql);

            for (int i = 0; i < params.length; i++) {
                statement.setObject(i + 1, params[i]);
            }

            return statement.executeQuery();

        } catch (SQLException e) {
            connection.close();
            throw e;
        }
    }
}