package org.kafka_tks_erp.core;

import java.util.ArrayList;
import java.util.List;

public class ServiceManager {

    private final List<ManagedService> services = new ArrayList<>();

    public void register(ManagedService service) {
        services.add(service);
    }

    public void startAll() throws Exception {
        for (ManagedService service : services) {
            System.out.println(
                    "Starting: " + service.getName()
            );

            service.start();
        }
    }

    public void stopAll() {
        for (int i = services.size() - 1; i >= 0; i--) {
            ManagedService service = services.get(i);

            try {
                service.stop();
            } catch (Exception e) {
                System.err.println(
                        "Cannot stop: " + service.getName()
                );
            }
        }
    }
}