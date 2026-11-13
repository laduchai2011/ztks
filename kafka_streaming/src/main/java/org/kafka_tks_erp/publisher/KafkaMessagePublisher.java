package org.kafka_tks_erp.publisher;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

import org.apache.kafka.common.header.internals.RecordHeader;

import org.kafka_tks_erp.dto.kafka.KafkaEventDTO;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

public class KafkaMessagePublisher {

    private final KafkaProducer<String, String> producer;

    public KafkaMessagePublisher(
            KafkaProducer<String, String> producer
    ) {
        this.producer = producer;
    }

    /**
     * Publish một event lên Kafka.
     *
     * @return RecordMetadata khi Kafka xác nhận thành công.
     */
    public RecordMetadata publish(
            KafkaEventDTO event
    ) throws Exception {

        ProducerRecord<String, String> record =
                new ProducerRecord<>(
                        event.topic(),
                        event.aggregateId().toString(),
                        event.payload()
                );

        // Event ID
        record.headers().add(
                new RecordHeader(
                        "event_id",
                        event.id()
                                .toString()
                                .getBytes(StandardCharsets.UTF_8)
                )
        );

        // Event Type
        record.headers().add(
                new RecordHeader(
                        "event_type",
                        event.eventType()
                                .getBytes(StandardCharsets.UTF_8)
                )
        );

        // Aggregate Type
        record.headers().add(
                new RecordHeader(
                        "aggregate_type",
                        event.aggregateType()
                                .getBytes(StandardCharsets.UTF_8)
                )
        );

        // Gửi và chờ Kafka ACK
        return producer
                .send(record)
                .get(65, TimeUnit.SECONDS);
    }

    public void close() {
        producer.close();
    }
}