package org.kafka_tks_erp.services.shop;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.kafka_tks_erp.config.EnvironmentConfig;
import org.kafka_tks_erp.dto.shop.DeleteStoreRequest;
import org.kafka_tks_erp.utils.ApiSignature;
import org.kafka_tks_erp.url.SHOP_URL;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

public class DeleteStoreService {

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public void deleteStore(UUID id, UUID account_id) {

        try {

            DeleteStoreRequest body =
                    new DeleteStoreRequest(id, account_id);

            String json = objectMapper.writeValueAsString(body);

            String secret =
                    EnvironmentConfig.getEnv("KEY_JAVA_KAFKA_REQUEST");

            if (secret == null || secret.isBlank()) {
                throw new RuntimeException(
                        "KEY_JAVA_KAFKA_REQUEST is missing"
                );
            }

            String timestamp = String.valueOf(
                    System.currentTimeMillis()
            );

            String signature = ApiSignature.generate(
                    timestamp,
                    secret
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(SHOP_URL.DELETE_STORE))
                    .header("Content-Type", "application/json")
                    .header("X-API-Timestamp", timestamp)
                    .header("X-API-Signature", signature)
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (
                    response.statusCode() < 200 ||
                            response.statusCode() >= 300
            ) {
                throw new RuntimeException(
                        "Delete store failed: " + response.body()
                );
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to send delete store request",
                    e
            );
        }
    }
}