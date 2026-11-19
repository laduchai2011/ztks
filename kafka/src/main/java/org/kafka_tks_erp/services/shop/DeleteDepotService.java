package org.kafka_tks_erp.services.shop;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.kafka_tks_erp.config.EnvironmentConfig;
import org.kafka_tks_erp.dto.shop.DeleteDepotRequest;
import org.kafka_tks_erp.utils.ApiSignature;
import org.kafka_tks_erp.url.SHOP_URL;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

public class DeleteDepotService {

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public void deleteDepot(UUID id, UUID account_id) {

        try {

            DeleteDepotRequest body =
                    new DeleteDepotRequest(id, account_id);

            String json = objectMapper.writeValueAsString(body);

            String secret = EnvironmentConfig.getEnv("KEY_JAVA_KAFKA_REQUEST");
            System.out.println(
                    "KEY_JAVA_KAFKA_REQUEST: " + secret
            );

            String timestamp = String.valueOf(
                    System.currentTimeMillis()
            );

            String signature = ApiSignature.generate(
                    timestamp,
                    secret
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(SHOP_URL.DELETE_DEPOT))
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

            if (response.statusCode() < 200 ||
                    response.statusCode() >= 300) {

                throw new RuntimeException(
                        "Delete depot failed: " + response.body()
                );
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send delete depot request",
                    e
            );
        }
    }
}