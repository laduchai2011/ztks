import { pool } from '@src/connect/postgresql';
import { Order_V1_Field, Order_V1_Type_Enum } from '@src/data_struct/order_v1';
import {
    Create_Order_V1_Body_Field,
    Create_Order_V1_Inventory_Reservation_Body_Field,
    Create_Order_V1_Service_Body_Field,
} from '@src/data_struct/order_v1/body';
import {
    Kafka_Event_Field,
    Kafka_Event_Event_Type_Enum,
    Kafka_Event_Aggregate_Type_Enum,
} from '@src/data_struct/kafka';
import { Create_Kafka_Event_Body_Field } from '@src/data_struct/kafka/body';

class MutateDB_Create_Order_V1 {
    private _create_order_v1_body: Create_Order_V1_Body_Field | undefined;
    private _payload: Create_Order_V1_Inventory_Reservation_Body_Field[] | Create_Order_V1_Service_Body_Field[] = [];

    set_Create_Order_V1_Body(create_order_v1_body: Create_Order_V1_Body_Field): void {
        this._create_order_v1_body = create_order_v1_body;
    }

    set_Payload(
        payload: Create_Order_V1_Inventory_Reservation_Body_Field[] | Create_Order_V1_Service_Body_Field[]
    ): void {
        this._payload = payload;
    }

    async run(): Promise<Order_V1_Field | undefined> {
        if (this._create_order_v1_body !== undefined && this._payload !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result_order_v1 = await client.query<Order_V1_Field>(
                    'SELECT * FROM create_order_v1($1::VARCHAR(255), $2::TEXT, $3::VARCHAR(255), $4::VARCHAR(255), $5::UUID, $6::UUID, $7::UUID, $8::BOOLEAN, $9::DECIMAL(20,2), $10::TEXT[], $11::TEXT[], $12::UUID, $13::UUID)',
                    [
                        this._create_order_v1_body.title,
                        this._create_order_v1_body.content,
                        this._create_order_v1_body.idempotency_key,
                        this._create_order_v1_body.type,
                        this._create_order_v1_body.sales_team_id,
                        this._create_order_v1_body.created_account_id,
                        this._create_order_v1_body.admin_account_id,
                        this._create_order_v1_body.is_pay ?? false,
                        this._create_order_v1_body.money ?? 0,
                        this._create_order_v1_body.images ?? [],
                        this._create_order_v1_body.videos ?? [],
                        this._create_order_v1_body.customer_v1_id ?? null,
                        this._create_order_v1_body.received_account_id ?? null,
                    ]
                );

                if (result_order_v1.rows.length === 0) {
                    await client.query('ROLLBACK');
                }

                const new_order_v1 = result_order_v1.rows[0];

                switch (new_order_v1.type) {
                    case Order_V1_Type_Enum.PRODUCT: {
                        const create_kafka_event_body: Create_Kafka_Event_Body_Field = {
                            aggregate_id: new_order_v1.id,
                            aggregate_type: Kafka_Event_Aggregate_Type_Enum.ORDER_V1,
                            event_type: Kafka_Event_Event_Type_Enum.ORDER_V1_CREATED,
                            payload: this._payload as unknown as Create_Order_V1_Inventory_Reservation_Body_Field[],
                        };

                        for (let i: number = 0; i < create_kafka_event_body.payload.length; i++) {
                            create_kafka_event_body.payload[i].order_v1_id = result_order_v1.rows[0].id;
                        }

                        const result_kafka_event = await client.query<Kafka_Event_Field>(
                            'SELECT * FROM create_kafka_event($1::UUID, $2::VARCHAR(100), $3::VARCHAR(100), $4::JSONB)',
                            [
                                create_kafka_event_body.aggregate_id,
                                create_kafka_event_body.aggregate_type,
                                create_kafka_event_body.event_type,
                                create_kafka_event_body.payload,
                            ]
                        );

                        if (result_kafka_event.rows.length === 0) {
                            await client.query('ROLLBACK');
                        }

                        await client.query('COMMIT');

                        return new_order_v1;

                        // if (result_order_v1.rows.length > 0) {
                        //     return result_order_v1.rows[0];
                        // }
                        // break;
                    }
                    case Order_V1_Type_Enum.SERVICE: {
                        //statements;
                        break;
                    }
                    default: {
                        //statements;
                        break;
                    }
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Create order error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Create_Order_V1;
