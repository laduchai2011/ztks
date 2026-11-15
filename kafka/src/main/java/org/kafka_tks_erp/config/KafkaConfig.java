
package org.kafka_tks_erp.config;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class KafkaConfig {

    public static Properties createProperties() {

        Properties props = new Properties();

        // Bootstrap servers
        String bootstrapServers =
                EnvironmentConfig.getEnv("KAFKA_BOOTSTRAP_SERVERS");

        props.put("bootstrap.servers", bootstrapServers);

        // Security
        props.put(
                "security.protocol",
                EnvironmentConfig.getEnv("KAFKA_SECURITY_PROTOCOL")
        );

        props.put(
                "sasl.mechanism",
                EnvironmentConfig.getEnv("KAFKA_SASL_MECHANISM")
        );

        String username =
                EnvironmentConfig.getEnv("KAFKA_USERNAME");

        String password =
                EnvironmentConfig.getEnv("KAFKA_PASSWORD");

        props.put(
                "sasl.jaas.config",
                "org.apache.kafka.common.security.plain.PlainLoginModule required " +
                        "username=\"" + username + "\" " +
                        "password=\"" + password + "\";"
        );

        // Serializer
        props.put("key.serializer", StringSerializer.class.getName());
        props.put("value.serializer", StringSerializer.class.getName());

        // Reliability
        props.put("acks", "all");
        props.put("retries", 10);
        props.put("enable.idempotence", true);

        return props;
    }

    public static KafkaProducer<String, String> createProducer(String s) {

        Properties props = createProperties();

        System.out.println(
                "[Kafka] Environment: " + EnvironmentConfig.getAppEnv()
        );

        System.out.println(
                "[Kafka] Bootstrap: " + props.getProperty("bootstrap.servers")
        );

        return new KafkaProducer<>(props);
    }
}
