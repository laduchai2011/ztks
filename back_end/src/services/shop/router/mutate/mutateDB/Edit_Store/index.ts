import { pool } from '@src/connect/postgresql';
import { Store_Field } from '@src/data_struct/shop';
import { Edit_Store_Body_Field } from '@src/data_struct/shop/body';
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

class MutateDB_Edit_Store {
    private _edit_store_body: Edit_Store_Body_Field | undefined;

    set_Edit_Store_Body(edit_store_body: Edit_Store_Body_Field): void {
        this._edit_store_body = edit_store_body;
    }

    async run(): Promise<Store_Field | undefined> {
        if (this._edit_store_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Store_Field>(
                    'SELECT * FROM edit_store($1::UUID, $2, $3, $4, $5::UUID)',
                    [
                        this._edit_store_body.id,
                        this._edit_store_body.name,
                        this._edit_store_body.description,
                        this._edit_store_body.content,
                        this._edit_store_body.account_id,
                    ]
                );

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('EDIT_STORE_FAILED');
                } else {
                    const store = result.rows[0];

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Store_Field> = {
                        aggregate_id: store.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.SHOP,
                        event_type: Kafka_Event_Event_Type_Enum.STORE_EDITED,
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

                console.error('Edit_Store error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Edit_Store;
