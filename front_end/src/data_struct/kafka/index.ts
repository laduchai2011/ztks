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
// import { getEnv } from '@src/mode';
// import { myEnv } from '@src/mode/type';

// const prefix = getEnv() === myEnv.Dev ? 'dev' : '';

export enum Kafka_Event_Topic_Enum {
    ORDER_EVENTS = 'order_events',
    PRODUCT_EVENTS = 'product_events',
    SHOP_EVENTS = 'shop_events',
}

export type Kafka_Event_Topic_Type =
    | Kafka_Event_Topic_Enum.ORDER_EVENTS
    | Kafka_Event_Topic_Enum.PRODUCT_EVENTS
    | Kafka_Event_Topic_Enum.SHOP_EVENTS;

export enum Kafka_Event_Aggregate_Type_Enum {
    ORDER_V1 = 'order_v1',
    PRODUCT = 'product',
    SHOP = 'shop',
}

export type Kafka_Event_Aggregate_Type_Type =
    | Kafka_Event_Aggregate_Type_Enum.ORDER_V1
    | Kafka_Event_Aggregate_Type_Enum.PRODUCT
    | Kafka_Event_Aggregate_Type_Enum.SHOP;

export enum Kafka_Event_Event_Type_Enum {
    ORDER_V1_CREATED = 'order_v1_created',
    PRODUCT_CODE_CREATED = 'product_code_created',
    PRODUCT_CREATED = 'product_created',
    PRODUCT_EDITED = 'product_edited',
    PRODUCT_DELETED = 'product_deleted',
    SHOP_CREATED = 'shop_created',
    DEPOT_CREATED = 'depot_created',
    STORE_CREATED = 'store_created',
    SHOP_EDITED = 'shop_edited',
    DEPOT_EDITED = 'depot_edited',
    STORE_EDITED = 'store_edited',
    SHOP_DELETED = 'shop_deleted',
    DEPOT_DELETED = 'depot_deleted',
    STORE_DELETED = 'store_deleted',
}

export type Kafka_Event_Event_Type_Type =
    | Kafka_Event_Event_Type_Enum.ORDER_V1_CREATED
    | Kafka_Event_Event_Type_Enum.PRODUCT_CODE_CREATED
    | Kafka_Event_Event_Type_Enum.PRODUCT_CREATED
    | Kafka_Event_Event_Type_Enum.PRODUCT_EDITED
    | Kafka_Event_Event_Type_Enum.PRODUCT_DELETED
    | Kafka_Event_Event_Type_Enum.SHOP_CREATED
    | Kafka_Event_Event_Type_Enum.DEPOT_CREATED
    | Kafka_Event_Event_Type_Enum.STORE_CREATED
    | Kafka_Event_Event_Type_Enum.SHOP_EDITED
    | Kafka_Event_Event_Type_Enum.DEPOT_EDITED
    | Kafka_Event_Event_Type_Enum.STORE_EDITED
    | Kafka_Event_Event_Type_Enum.SHOP_DELETED
    | Kafka_Event_Event_Type_Enum.DEPOT_DELETED
    | Kafka_Event_Event_Type_Enum.STORE_DELETED;

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
