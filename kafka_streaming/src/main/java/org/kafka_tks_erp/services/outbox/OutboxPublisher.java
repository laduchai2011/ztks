package org.kafka_tks_erp.services.outbox;

import org.kafka_tks_erp.dto.kafka.KafkaEventDTO;
import org.kafka_tks_erp.publisher.KafkaMessagePublisher;

import org.apache.kafka.clients.producer.RecordMetadata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class OutboxPublisher {

    private static final Logger logger =
            LoggerFactory.getLogger(OutboxPublisher.class);

    private final OutboxRepository repository;

    private final KafkaMessagePublisher kafkaPublisher;

    private final String workerId;

    private static final int BATCH_SIZE = 1;

    private static final int LEASE_SECONDS = 120;

    public OutboxPublisher(
            OutboxRepository repository,
            KafkaMessagePublisher kafkaPublisher,
            String workerId
    ) {

        this.repository = repository;

        this.kafkaPublisher = kafkaPublisher;

        this.workerId = workerId;
    }

    /**
     * Publish một batch event.
     *
     * @return số lượng event đã claim.
     */
    public int publishBatch() throws Exception {

        List<KafkaEventDTO> events =
                repository.claimBatch(
                        workerId,
                        BATCH_SIZE,
                        LEASE_SECONDS
                );

        if (events.isEmpty()) {
            return 0;
        }

        for (KafkaEventDTO event : events) {

            publishEvent(event);
        }

        return events.size();
    }

    /**
     * Xử lý một event.
     */
    private void publishEvent(
            KafkaEventDTO event
    ) {

        try {

            logger.info(
                    "Publishing event: {} | Topic: {} | Attempt: {}/{}",
                    event.id(),
                    event.topic(),
                    event.attempts(),
                    event.maxAttempts()
            );

            // 1. Gửi Kafka
            RecordMetadata metadata =
                    kafkaPublisher.publish(event);

            // 2. Kafka ACK thành công
            logger.info(
                    "Kafka ACK | Event: {} | Topic: {} | Partition: {} | Offset: {}",
                    event.id(),
                    metadata.topic(),
                    metadata.partition(),
                    metadata.offset()
            );

            // 3. Cập nhật PostgreSQL
            boolean published =
                    repository.markPublished(
                            event.id(),
                            workerId
                    );

            if (!published) {

                logger.warn(
                        "Event {} was acknowledged by Kafka, but its lease is no longer owned by worker {}",
                        event.id(),
                        workerId
                );

                return;
            }

            logger.info(
                    "Event {} marked as published",
                    event.id()
            );

        } catch (Exception e) {

            logger.error(
                    "Publish event {} failed",
                    event.id(),
                    e
            );

            // 4. Retry
            try {

                boolean retried =
                        repository.retry(
                                event.id(),
                                workerId,
                                e.getClass().getSimpleName()
                                        + ": "
                                        + String.valueOf(e.getMessage())
                        );

                if (retried) {

                    logger.warn(
                            "Event {} scheduled for retry",
                            event.id()
                    );

                } else {

                    logger.warn(
                            "Cannot retry event {} because lease is no longer owned by worker {}",
                            event.id(),
                            workerId
                    );
                }

            } catch (Exception retryError) {

                logger.error(
                        "Cannot update retry state for event {}",
                        event.id(),
                        retryError
                );
            }
        }
    }

    /**
     * Đẩy sự kiện lên topic.
     */
    private String resolveTopic(KafkaEventDTO event) {

        return switch (event.aggregateType()) {
            case "product_events" -> "product_events";
            case "order_events" -> "order_events";

            default -> throw new IllegalArgumentException(
                    "Unsupported aggregate type: " + event.aggregateType()
            );
        };
    }
}