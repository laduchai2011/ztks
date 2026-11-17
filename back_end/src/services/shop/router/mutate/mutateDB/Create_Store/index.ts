import { pool } from '@src/connect/postgresql';
import { Store_Field } from '@src/data_struct/shop';
import { Create_Store_Body_Field } from '@src/data_struct/shop/body';
import {
    Kafka_Event_Field,
    Kafka_Event_Topic_Enum,
    Kafka_Event_Event_Type_Enum,
    Kafka_Event_Aggregate_Type_Enum,
} from '@src/data_struct/kafka';
import { Create_Kafka_Event_Body_Field } from '@src/data_struct/kafka/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

class MutateDB_Create_Store {
    private _create_store_body: Create_Store_Body_Field | undefined;

    set_Create_Store_Body(create_store_body: Create_Store_Body_Field): void {
        this._create_store_body = create_store_body;
    }

    async run(): Promise<Store_Field | undefined> {
        if (this._create_store_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Store_Field>(
                    'SELECT * FROM create_store($1, $2, $3, $4::UUID, $5::UUID)',
                    [
                        this._create_store_body.name,
                        this._create_store_body.description,
                        this._create_store_body.content,
                        this._create_store_body.depot_id,
                        this._create_store_body.account_id,
                    ]
                );

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('CREATE_ORDER_FAILED');
                } else {
                    const store = result.rows[0];

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Store_Field> = {
                        aggregate_id: store.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.SHOP,
                        event_type: Kafka_Event_Event_Type_Enum.STORE_CREATE,
                        topic: Kafka_Event_Topic_Enum.SHOP_EVENTS,
                        payload: store,
                    };

                    const result_kafka_event = await client.query<Kafka_Event_Field>(
                        'SELECT * FROM create_kafka_event($1::UUID, $2, $3, $4, $5::JSONB)',
                        [
                            create_kafka_event_body.aggregate_id,
                            create_kafka_event_body.aggregate_type,
                            create_kafka_event_body.event_type,
                            create_kafka_event_body.topic + prefix,
                            create_kafka_event_body.payload,
                        ]
                    );

                    if (result_kafka_event.rows.length === 0) {
                        await client.query('ROLLBACK');
                        throw new Error('CREATE_KAFKA_EVENT_FAILED');
                    }

                    await client.query('COMMIT');
                    return store;
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Create_Store error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Create_Store;
