package org.kafka_tks_erp.services.product;

import org.kafka_tks_erp.config.KafkaConsumerConfig;

import org.apache.kafka.clients.consumer.KafkaConsumer;

public class ProductConsumer implements Runnable {

    private static final String TOPIC = "product_events";

    private static final String GROUP_ID = "ztks-product";

    @Override
    public void run() {

        KafkaConsumer<String, String> consumer =
                new KafkaConsumer<>(
                        KafkaConsumerConfig.createProperties(GROUP_ID)
                );

        consumer.subscribe(
                java.util.Collections.singletonList(TOPIC)
        );

        try {

            while (!Thread.currentThread().isInterrupted()) {

                var records = consumer.poll(
                        java.time.Duration.ofMillis(1000)
                );

                for (var record : records) {

                    System.out.println(
                            "Topic: " + record.topic()
                                    + " | Event: " + record.value()
                    );

                    // TODO: Gọi ProductEventHandler
                    // TODO: Gọi ProductCodeEventHandler
                }

                consumer.commitSync();
            }

        } finally {
            consumer.close();
        }
    }
}