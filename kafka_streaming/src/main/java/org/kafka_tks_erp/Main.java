package org.kafka_tks_erp;

import org.kafka_tks_erp.config.KafkaConfig;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        //TIP Press <shortcut actionId="ShowIntentionActions"/> with your caret at the highlighted text
        // to see how IntelliJ IDEA suggests fixing it.
        System.out.println("Main Application started");

        // Inventory
        KafkaConfig.create("ztks-inventory");

        // Analytics
        KafkaConfig.create("ztks-analytics");
    }
}