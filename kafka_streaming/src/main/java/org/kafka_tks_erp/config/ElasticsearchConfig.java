package org.kafka_tks_erp.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest5_client.Rest5ClientTransport;
import co.elastic.clients.transport.rest5_client.low_level.Rest5Client;

import org.apache.hc.client5.http.auth.AuthScope;
import org.apache.hc.client5.http.auth.UsernamePasswordCredentials;
import org.apache.hc.client5.http.impl.auth.BasicCredentialsProvider;
import org.apache.hc.core5.http.HttpHost;

public class ElasticsearchConfig {

    private static ElasticsearchClient client;
    private static Rest5Client restClient;

    private ElasticsearchConfig() {
    }

    public static synchronized ElasticsearchClient getClient() {

        if (client == null) {

            String host =
                    EnvironmentConfig.getEnv("ELASTIC_HOST");

            String username =
                    EnvironmentConfig.getEnv("ELASTIC_USERNAME");

            String password =
                    EnvironmentConfig.getEnv("ELASTIC_PASSWORD");

            BasicCredentialsProvider credentialsProvider =
                    new BasicCredentialsProvider();

            credentialsProvider.setCredentials(
                    new AuthScope(null, -1),
                    new UsernamePasswordCredentials(
                            username,
                            password.toCharArray()
                    )
            );

            try {

                restClient = Rest5Client.builder(
                        HttpHost.create(host)
                ).setHttpClientConfigCallback(
                        httpClientBuilder ->
                                httpClientBuilder.setDefaultCredentialsProvider(
                                        credentialsProvider
                                )
                ).build();

            } catch (Exception e) {

                throw new IllegalStateException(
                        "Cannot initialize Elasticsearch connection",
                        e
                );
            }

            ElasticsearchTransport transport =
                    new Rest5ClientTransport(
                            restClient,
                            new JacksonJsonpMapper()
                    );

            client = new ElasticsearchClient(transport);
        }

        return client;
    }

    public static synchronized void close() throws Exception {

        if (restClient != null) {
            restClient.close();

            restClient = null;
            client = null;
        }
    }
}