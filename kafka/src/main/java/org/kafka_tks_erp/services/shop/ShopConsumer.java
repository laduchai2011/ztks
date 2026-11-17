package org.kafka_tks_erp.services.shop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.kafka_tks_erp.config.EnvironmentConfig;
import org.kafka_tks_erp.config.KafkaConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.kafka_tks_erp.dto.shop.DepotDTO;
import org.kafka_tks_erp.dto.shop.ShopDTO;
import org.kafka_tks_erp.dto.shop.StoreDTO;
import org.kafka_tks_erp.services.kafka.ProcessedKafkaEventService;

import java.nio.charset.StandardCharsets;

public class ShopConsumer implements Runnable {

    private static final String prefix = EnvironmentConfig.getEnv("PREFIX");

    private static final String TOPIC = "shop_events" + prefix;

    private static final String GROUP_ID = "ztks-shop" + prefix;

    private final ProcessedKafkaEventService processedEventService =
            new ProcessedKafkaEventService();

    @Override
    public void run() {

        KafkaConsumer<String, String> consumer =
                new KafkaConsumer<>(
                        KafkaConsumerConfig.createProperties(GROUP_ID)
                );

        try (consumer) {
            consumer.subscribe(
                    java.util.Collections.singletonList(TOPIC)
            );

            while (!Thread.currentThread().isInterrupted()) {

                var records = consumer.poll(
                        java.time.Duration.ofMillis(1000)
                );

                for (var record : records) {

                    String event_id = new String(
                            record.headers().lastHeader("event_id").value(),
                            StandardCharsets.UTF_8
                    );

                    String event_type = new String(
                            record.headers().lastHeader("event_type").value(),
                            StandardCharsets.UTF_8
                    );

                    String payload = record.value();

//                    System.out.println(
//                            "Topic: " + record.topic()
//                                    + " " + event_type
//                                    + " | Event: " + record.value()
//                    );

                    // TODO: Gọi ProductEventHandler
                    // TODO: Gọi ProductCodeEventHandler

                    if (event_type.equals("shop_created")) {

                        ObjectMapper objectMapper = new ObjectMapper();

//                        objectMapper.setPropertyNamingStrategy(
//                                PropertyNamingStrategies.SNAKE_CASE
//                        );
                        // Hỗ trợ LocalDateTime, OffsetDateTime, Instant...
                        objectMapper.registerModule(new JavaTimeModule());

                        // Không chuyển ngày giờ thành timestamp dạng số
                        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                        try {
                            ShopDTO shop = objectMapper.readValue(
                                    payload,
                                    ShopDTO.class
                            );

                            ElasticShopService elasticShopService = new ElasticShopService();
                            elasticShopService.create(shop.id().toString(), shop.account_id().toString(), shop.name() + " " + shop.description());

                            boolean registered = processedEventService.register(
                                    GROUP_ID,
                                    event_id,
                                    event_type,
                                    record.topic()
                            );

                            if (!registered) {
                                System.out.println("Event already registered: " + event_id);
                            }

                            consumer.commitSync();
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    } else if (event_type.equals("depot_created")) {

                        ObjectMapper objectMapper = new ObjectMapper();

//                        objectMapper.setPropertyNamingStrategy(
//                                PropertyNamingStrategies.SNAKE_CASE
//                        );
                        // Hỗ trợ LocalDateTime, OffsetDateTime, Instant...
                        objectMapper.registerModule(new JavaTimeModule());

                        // Không chuyển ngày giờ thành timestamp dạng số
                        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                        try {
                            DepotDTO depot = objectMapper.readValue(
                                    payload,
                                    DepotDTO.class
                            );

                            ElasticDepotService elasticDepotService = new ElasticDepotService();
                            elasticDepotService.create(depot.id().toString(), depot.shop_id().toString(), depot.name() + " " + depot.description());

                            boolean registered = processedEventService.register(
                                    GROUP_ID,
                                    event_id,
                                    event_type,
                                    record.topic()
                            );

                            if (!registered) {
                                System.out.println("Event already registered: " + event_id);
                            }

                            consumer.commitSync();
                        }catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    } else if (event_type.equals("store_created")) {

                        ObjectMapper objectMapper = new ObjectMapper();

//                        objectMapper.setPropertyNamingStrategy(
//                                PropertyNamingStrategies.SNAKE_CASE
//                        );
                        // Hỗ trợ LocalDateTime, OffsetDateTime, Instant...
                        objectMapper.registerModule(new JavaTimeModule());

                        // Không chuyển ngày giờ thành timestamp dạng số
                        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                        try {
                            StoreDTO depot = objectMapper.readValue(
                                    payload,
                                    StoreDTO.class
                            );

                            ElasticStoreService elasticStoreService = new ElasticStoreService();
                            elasticStoreService.create(depot.id().toString(), depot.depot_id().toString(), depot.name() + " " + depot.description());

                            boolean registered = processedEventService.register(
                                    GROUP_ID,
                                    event_id,
                                    event_type,
                                    record.topic()
                            );

                            if (!registered) {
                                System.out.println("Event already registered: " + event_id);
                            }

                            consumer.commitSync();
                        }catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }
                }

//                consumer.commitSync();
            }

        }
    }
}