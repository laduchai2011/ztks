
package org.kafka_tks_erp.utils;

import org.kafka_tks_erp.dto.kafka.KafkaEventDTO;

import java.util.List;

public class KafkaEventLogger {

    public static void printEvents(List<KafkaEventDTO> events) {

        System.out.println("\n");
        System.out.println("==================================================");
        System.out.println("              OUTBOX EVENTS");
        System.out.println("==================================================");

        System.out.println("Total events: " + events.size());

        for (KafkaEventDTO event : events) {

            System.out.println("\n--------------------------------------------------");

            System.out.println("ID              : " + event.id());
            System.out.println("Aggregate ID    : " + event.aggregateId());
            System.out.println("Aggregate Type  : " + event.aggregateType());
            System.out.println("Event Type      : " + event.eventType());
            System.out.println("Topic           : " + event.topic());
            System.out.println("Payload         : " + event.payload());
            System.out.println("Status          : " + event.status());
            System.out.println("Attempts        : " + event.attempts());
            System.out.println("Max Attempts    : " + event.maxAttempts());
            System.out.println("Next Attempt At : " + event.nextAttemptAt());
            System.out.println("Locked By       : " + event.lockedBy());
            System.out.println("Locked Until    : " + event.lockedUntil());
            System.out.println("Last Error      : " + event.lastError());
            System.out.println("Created At      : " + event.createdAt());
            System.out.println("Published At    : " + event.publishedAt());
        }

        System.out.println("\n==================================================");
        System.out.println("              END OUTBOX EVENTS");
        System.out.println("==================================================\n");
    }
}
