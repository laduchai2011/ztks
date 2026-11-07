package org.kafka_tks_erp;

import java.util.Properties;

public class KafkaConfig {

    private static final String BOOTSTRAP_SERVERS = "103.38.236.182:9094";

    private static final String USERNAME = "adminztks";
    private static final String PASSWORD = "adminztks";

    public static Properties getProperties() {

        Properties props = new Properties();

        props.put(
                "bootstrap.servers",
                BOOTSTRAP_SERVERS
        );

        props.put(
                "security.protocol",
                "SASL_PLAINTEXT"
        );

        props.put(
                "sasl.mechanism",
                "PLAIN"
        );

        props.put(
                "sasl.jaas.config",
                "org.apache.kafka.common.security.plain.PlainLoginModule required " +
                        "username=\"" + USERNAME + "\" " +
                        "password=\"" + PASSWORD + "\";"
        );

        return props;
    }
}