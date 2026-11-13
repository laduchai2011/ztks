// import { Create_Order_V1_Inventory_Reservation_Body_Field } from '../order_v1/body';
// import { Kafka_Event_Aggregate_Type_Type, Kafka_Event_Event_Type_Type } from '.';

// export interface Create_Kafka_Event_Body_Field {
//     aggregate_id: string;
//     aggregate_type: Kafka_Event_Aggregate_Type_Type;
//     event_type: Kafka_Event_Event_Type_Type;
//     payload: Create_Order_V1_Inventory_Reservation_Body_Field[];
// }

// export interface Mark_Kafka_Event_Processed_Body_Field {
//     kafka_event_id: string;
// }

// import { Product_Code_Field } from '@src/data_struct/product';

// import { Create_Order_V1_Inventory_Reservation_Body_Field } from '../order_v1/body';
import { Kafka_Event_Topic_Type, Kafka_Event_Aggregate_Type_Type, Kafka_Event_Event_Type_Type } from '.';

export interface Create_Kafka_Event_Body_Field<T> {
    aggregate_id: string;
    aggregate_type: Kafka_Event_Aggregate_Type_Type;
    event_type: Kafka_Event_Event_Type_Type;
    topic: Kafka_Event_Topic_Type;
    payload: T;
}

export interface Claim_Kafka_Events_Body_Field {
    worker_id: string;
    limit: number;
    lease_seconds: number;
}

export interface Renew_Kafka_Event_Lease_Body_Field {
    event_id: string;
    worker_id: string;
    lease_seconds: number;
}

export interface Mark_Kafka_Event_Processed_Body_Field {
    kafka_event_id: string;
    worker_id: string;
}

export interface Retry_Kafka_Event_Body_Field {
    event_id: string;
    worker_id: string;
    error: string;
}

export interface Register_Processed_Kafka_Event_Body_Field {
    consumer_name: string;
    event_id: string;
    event_type: string;
    topic: string;
}
