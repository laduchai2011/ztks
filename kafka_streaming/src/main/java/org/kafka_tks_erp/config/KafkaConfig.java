package org.kafka_tks_erp.config;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsConfig;
import org.kafka_tks_erp.config.EnvironmentConfig;

import java.util.Properties;

public class KafkaConfig {

    public static Properties create(String applicationId) {

        Properties props = new Properties();

        props.put(
                StreamsConfig.APPLICATION_ID_CONFIG,
                applicationId
        );

        props.put(
                StreamsConfig.BOOTSTRAP_SERVERS_CONFIG,
                EnvironmentConfig.getEnv("KAFKA_BOOTSTRAP_SERVERS")
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
                EnvironmentConfig.getEnv("KAFKA_SECURITY_PROTOCOL"));

        props.put("sasl.mechanism",
                EnvironmentConfig.getEnv("KAFKA_SASL_MECHANISM"));

        String username = EnvironmentConfig.getEnv("KAFKA_USERNAME");
        String password = EnvironmentConfig.getEnv("KAFKA_PASSWORD");

        props.put(
                "sasl.jaas.config",
                "org.apache.kafka.common.security.plain.PlainLoginModule required " +
                        "username=\"" + username + "\" " +
                        "password=\"" + password + "\";"
        );

        return props;
    }
}
