import { pool } from '@src/connect/postgresql';
import { Shop_Field } from '@src/data_struct/shop';
import { Delete_Shop_Body_Field } from '@src/data_struct/shop/body';
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

class MutateDB_Delete_Shop {
    private _delete_shop_body: Delete_Shop_Body_Field | undefined;

    set_Delete_Shop_Body(delete_shop_body: Delete_Shop_Body_Field): void {
        this._delete_shop_body = delete_shop_body;
    }

    async run(): Promise<Shop_Field | undefined> {
        if (this._delete_shop_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Shop_Field>('SELECT * FROM delete_shop($1::UUID, $2::UUID)', [
                    this._delete_shop_body.id,
                    this._delete_shop_body.account_id,
                ]);

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('DELETE_SHOP_FAILED');
                } else {
                    const shop = result.rows[0];

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Shop_Field> = {
                        aggregate_id: shop.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.SHOP,
                        event_type: Kafka_Event_Event_Type_Enum.SHOP_DELETED,
                        topic: Kafka_Event_Topic_Enum.SHOP_EVENTS,
                        payload: shop,
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
                    return shop;
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Delete_Shop error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Delete_Shop;
