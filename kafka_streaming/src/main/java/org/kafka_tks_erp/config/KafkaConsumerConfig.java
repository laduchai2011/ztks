package org.kafka_tks_erp.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.Properties;

public class KafkaConsumerConfig {

    public static Properties createProperties(String groupId) {

        // Tái sử dụng cấu hình kết nối và bảo mật
        Properties props = KafkaConfig.createProperties();

        // Xóa cấu hình riêng của Producer
        props.remove("key.serializer");
        props.remove("value.serializer");

        props.remove("acks");
        props.remove("retries");
        props.remove("enable.idempotence");

        // Consumer configuration
        props.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                groupId
        );

        props.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class.getName()
        );

        props.put(
                ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class.getName()
        );

        // Không tự động commit offset
        props.put(
                ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,
                false
        );

        // Đọc từ đầu nếu group chưa có offset
        props.put(
                ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,
                "earliest"
        );

        props.put(
                ConsumerConfig.MAX_POLL_RECORDS_CONFIG,
                100
        );

        return props;
    }
}