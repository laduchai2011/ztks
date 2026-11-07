// import { Create_Order_V1_Inventory_Reservation_Body_Field } from '../order_v1/body';

// export enum Kafka_Event_Aggregate_Type_Enum {
//     ORDER_V1 = 'order_v1',
// }

// export type Kafka_Event_Aggregate_Type_Type = Kafka_Event_Aggregate_Type_Enum.ORDER_V1;

// export enum Kafka_Event_Event_Type_Enum {
//     ORDER_V1_CREATED = 'order_v1_created',
// }

// export type Kafka_Event_Event_Type_Type = Kafka_Event_Event_Type_Enum.ORDER_V1_CREATED;

// export enum Kafka_Event_Status_Enum {
//     PENDING = 'pending',
//     PUBLISHED = 'published',
// }

// export type Kafka_Event_Status_Type = Kafka_Event_Status_Enum.PENDING | Kafka_Event_Status_Enum.PUBLISHED;

// export interface Kafka_Event_Field {
//     id: string;
//     aggregate_id: string;
//     aggregate_type: Kafka_Event_Aggregate_Type_Type;
//     event_type: Kafka_Event_Event_Type_Enum;
//     status: Kafka_Event_Status_Type;
//     payload: Create_Order_V1_Inventory_Reservation_Body_Field;
//     update_time: string;
//     create_time: string;
//     published_at: string | null;
// }

// export interface Kafka_Event_Processed_Field {
//     kafka_event_id: string;
//     processed_at: string;
// }

import { Create_Order_V1_Inventory_Reservation_Body_Field } from '../order_v1/body';

export enum Kafka_Event_Topic_Enum {
    ORDER_EVENTS = 'order-events',
}

export type Kafka_Event_Topic_Type = Kafka_Event_Topic_Enum.ORDER_EVENTS;

export enum Kafka_Event_Aggregate_Type_Enum {
    ORDER_V1 = 'order_v1',
}

export type Kafka_Event_Aggregate_Type_Type = Kafka_Event_Aggregate_Type_Enum.ORDER_V1;

export enum Kafka_Event_Event_Type_Enum {
    ORDER_V1_CREATED = 'order_v1_created',
}

export type Kafka_Event_Event_Type_Type = Kafka_Event_Event_Type_Enum.ORDER_V1_CREATED;

export enum Kafka_Event_Status_Enum {
    PENDING = 'pending',
    PROCESSING = 'processing',
    PUBLISHED = 'published',
    FAILED = 'failed',
}

export type Kafka_Event_Status_Type =
    | Kafka_Event_Status_Enum.PENDING
    | Kafka_Event_Status_Enum.PROCESSING
    | Kafka_Event_Status_Enum.PUBLISHED
    | Kafka_Event_Status_Enum.FAILED;

export interface Kafka_Event_Field {
    id: string;

    aggregate_id: string;
    aggregate_type: Kafka_Event_Aggregate_Type_Type;
    event_type: Kafka_Event_Event_Type_Enum;

    topic: Kafka_Event_Topic_Type;
    payload: Create_Order_V1_Inventory_Reservation_Body_Field;

    status: Kafka_Event_Status_Type;

    attempts: number;
    max_attempts: number;
    next_attempt_at: string;

    locked_by: string | null;
    locked_until: string | null;

    last_error: string | null;

    update_time: string;
    create_time: string;
    published_at: string | null;
}

export interface Kafka_Event_Processed_Field {
    consumer_name: string;
    kafka_event_id: string;
    event_type: Kafka_Event_Event_Type_Type;
    topic: Kafka_Event_Topic_Type;
    processed_at: string;
}
