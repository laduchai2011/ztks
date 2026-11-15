package org.kafka_tks_erp.core;

public interface ManagedService {

    String getName();

    void start() throws Exception;

    void stop();
}