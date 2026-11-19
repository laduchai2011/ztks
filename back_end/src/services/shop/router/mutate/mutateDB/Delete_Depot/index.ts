import { pool } from '@src/connect/postgresql';
import { Depot_Field } from '@src/data_struct/shop';
import { Delete_Depot_Body_Field } from '@src/data_struct/shop/body';
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

class MutateDB_Delete_Depot {
    private _delete_depot_body: Delete_Depot_Body_Field | undefined;

    set_Delete_Depot_Body(delete_depot_body: Delete_Depot_Body_Field): void {
        this._delete_depot_body = delete_depot_body;
    }

    async run(): Promise<Depot_Field | undefined> {
        if (this._delete_depot_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await client.query<Depot_Field>('SELECT * FROM delete_depot($1::UUID, $2::UUID)', [
                    this._delete_depot_body.id,
                    this._delete_depot_body.account_id,
                ]);

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('DELETE_DEPOT_FAILED');
                } else {
                    const depot = result.rows[0];

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Depot_Field> = {
                        aggregate_id: depot.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.SHOP,
                        event_type: Kafka_Event_Event_Type_Enum.DEPOT_DELETED,
                        topic: Kafka_Event_Topic_Enum.SHOP_EVENTS,
                        payload: depot,
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
                    return depot;
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Delete_Depot error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }

    async run_For_Kafka(): Promise<Depot_Field | undefined> {
        if (this._delete_depot_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await client.query<Depot_Field>('SELECT * FROM kafka_delete_depot($1::UUID, $2::UUID)', [
                    this._delete_depot_body.id,
                    this._delete_depot_body.account_id,
                ]);

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('DELETE_DEPOT_FAILED');
                } else {
                    const depot = result.rows[0];

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Depot_Field> = {
                        aggregate_id: depot.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.SHOP,
                        event_type: Kafka_Event_Event_Type_Enum.DEPOT_DELETED,
                        topic: Kafka_Event_Topic_Enum.SHOP_EVENTS,
                        payload: depot,
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
                    return depot;
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Delete_Depot error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Delete_Depot;
