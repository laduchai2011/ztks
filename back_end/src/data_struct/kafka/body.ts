import { Create_Order_V1_Inventory_Reservation_Body_Field } from '../order_v1/body';
import { Kafka_Event_Aggregate_Type_Type, Kafka_Event_Event_Type_Type } from '.';

export interface Create_Kafka_Event_Body_Field {
    aggregate_id: string;
    aggregate_type: Kafka_Event_Aggregate_Type_Type;
    event_type: Kafka_Event_Event_Type_Type;
    payload: Create_Order_V1_Inventory_Reservation_Body_Field[];
}

export interface Mark_Kafka_Event_Processed_Body_Field {
    kafka_event_id: string;
}
