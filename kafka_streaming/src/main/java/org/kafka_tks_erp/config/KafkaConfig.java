package org.kafka_tks_erp.config;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsConfig;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.Properties;

public class KafkaConfig {
    private static final Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();

    private static String getRequiredEnv(String name) {

        // Ưu tiên biến môi trường hệ điều hành
        String value = System.getenv(name);

        // Nếu không có thì đọc từ .env
        if (value == null || value.isBlank()) {
            value = dotenv.get(name);
        }

        if (value == null || value.isBlank()) {
            throw new IllegalStateException(
                    "Missing environment variable: " + name
            );
        }

        return value;
    }

    public static Properties create(String applicationId) {

        Properties props = new Properties();

        props.put(
                StreamsConfig.APPLICATION_ID_CONFIG,
                applicationId
        );

        props.put(
                StreamsConfig.BOOTSTRAP_SERVERS_CONFIG,
                getRequiredEnv("KAFKA_BOOTSTRAP_SERVERS")
        );

        props.put(
                StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG,
                Serdes.String().getClass()
        );

        props.put(
                StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG,
                Serdes.String().getClass()
        );

        props.put("security.protocol",
                getRequiredEnv("KAFKA_SECURITY_PROTOCOL"));

        props.put("sasl.mechanism",
                getRequiredEnv("KAFKA_SASL_MECHANISM"));

        String username = getRequiredEnv("KAFKA_USERNAME");
        String password = getRequiredEnv("KAFKA_PASSWORD");

        props.put(
                "sasl.jaas.config",
                "org.apache.kafka.common.security.plain.PlainLoginModule required " +
                        "username=\"" + username + "\" " +
                        "password=\"" + password + "\";"
        );

        return props;
    }
}
