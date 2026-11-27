package org.kafka_tks_erp.services.product;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.kafka_tks_erp.config.EnvironmentConfig;
import org.kafka_tks_erp.config.KafkaConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.kafka_tks_erp.dto.product.ProductCodeDTO;
import org.kafka_tks_erp.dto.product.ProductDTO;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.kafka_tks_erp.elastic.product.ElasticProductCodeService;
import org.kafka_tks_erp.elastic.product.ElasticProductService;
import org.kafka_tks_erp.services.kafka.ProcessedKafkaEventService;

import java.nio.charset.StandardCharsets;

public class ProductConsumer implements Runnable {

    private static final String prefix = EnvironmentConfig.getEnv("PREFIX");

    private static final String TOPIC = "product_events" + prefix;

    private static final String GROUP_ID = "ztks-product" + prefix;

    private final ProcessedKafkaEventService processedEventService =
            new ProcessedKafkaEventService();

    @Override
    public void run() {

        KafkaConsumer<String, String> consumer =
                new KafkaConsumer<>(
                        KafkaConsumerConfig.createProperties(GROUP_ID)
                );

        ElasticProductCodeService elasticProductCodeService = new ElasticProductCodeService();
        ElasticProductService elasticProductService = new ElasticProductService();

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

//                    System.out.println(
//                            "Topic: " + record.topic()
//                                    + " " + event_type
//                                    + " | Event: " + record.value()
//                    );

                    // TODO: Gọi ProductEventHandler
                    // TODO: Gọi ProductCodeEventHandler

                    if (event_type.equals("product_code_created")) {
                        String payload = record.value();

                        ObjectMapper objectMapper = new ObjectMapper();

//                        objectMapper.setPropertyNamingStrategy(
//                                PropertyNamingStrategies.SNAKE_CASE
//                        );
                        // Hỗ trợ LocalDateTime, OffsetDateTime, Instant...
                        objectMapper.registerModule(new JavaTimeModule());

                        // Không chuyển ngày giờ thành timestamp dạng số
                        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                        try {
                            ProductCodeDTO productCode = objectMapper.readValue(
                                    payload,
                                    ProductCodeDTO.class
                            );

                            elasticProductCodeService.create(productCode.id().toString(), productCode.account_id().toString(), productCode.name() + " " + productCode.description(), productCode.is_delete());

                            boolean registered = processedEventService.register(
                                    GROUP_ID,
                                    event_id,
                                    event_type,
                                    record.topic()
                            );

                            if (!registered) {
                                System.out.println("Event already registered: " + event_id);
                            }
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    } else if (event_type.equals("product_created") || event_type.equals("product_edited") || event_type.equals("product_re_deleted")) {
                        String payload = record.value();

                        ObjectMapper objectMapper = new ObjectMapper();

                        objectMapper.setPropertyNamingStrategy(
                                PropertyNamingStrategies.SNAKE_CASE
                        );
                        // Hỗ trợ LocalDateTime, OffsetDateTime, Instant...
                        objectMapper.registerModule(new JavaTimeModule());

                        // Không chuyển ngày giờ thành timestamp dạng số
                        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                        try {
                            ProductDTO product = objectMapper.readValue(
                                    payload,
                                    ProductDTO.class
                            );

                            elasticProductService.create(product.id().toString(), product.account_id().toString(), product.name() + " " + product.description(), product.is_delete());

                            boolean registered = processedEventService.register(
                                    GROUP_ID,
                                    event_id,
                                    event_type,
                                    record.topic()
                            );

                            if (!registered) {
                                System.out.println("Event already registered: " + event_id);
                            }
                        }catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }  else if (event_type.equals("product_deleted")) {
                        String payload = record.value();

                        ObjectMapper objectMapper = new ObjectMapper();

                        objectMapper.setPropertyNamingStrategy(
                                PropertyNamingStrategies.SNAKE_CASE
                        );
                        // Hỗ trợ LocalDateTime, OffsetDateTime, Instant...
                        objectMapper.registerModule(new JavaTimeModule());

                        // Không chuyển ngày giờ thành timestamp dạng số
                        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                        try {
                            ProductDTO product = objectMapper.readValue(
                                    payload,
                                    ProductDTO.class
                            );

                            elasticProductService.delete(product.id().toString());

                            boolean registered = processedEventService.register(
                                    GROUP_ID,
                                    event_id,
                                    event_type,
                                    record.topic()
                            );

                            if (!registered) {
                                System.out.println("Event already registered: " + event_id);
                            }
                        }catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }
                }

                consumer.commitSync();
            }

        }
    }
}