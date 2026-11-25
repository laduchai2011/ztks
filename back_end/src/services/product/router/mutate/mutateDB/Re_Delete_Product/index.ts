import { pool } from '@src/connect/postgresql';
import { Product_Field } from '@src/data_struct/product';
import { Re_Delete_Product_Body_Field, Upsert_Product_Total_Body_Field } from '@src/data_struct/product/body';
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

class MutateDB_Re_Delete_Product {
    private _re_Delete_product_body: Re_Delete_Product_Body_Field | undefined;

    set_Re_Delete_Product_Body(re_Delete_product_body: Re_Delete_Product_Body_Field): void {
        this._re_Delete_product_body = re_Delete_product_body;
    }

    async run(): Promise<Product_Field | undefined> {
        if (this._re_Delete_product_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await client.query<Product_Field>(
                    'SELECT * FROM re_delete_product($1::UUID, $2::UUID)',
                    [this._re_Delete_product_body.id, this._re_Delete_product_body.account_id]
                );

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('RE_DELETE_PRODUCT_FAILED');
                } else {
                    const product = result.rows[0];

                    const upsert_product_total_body: Upsert_Product_Total_Body_Field = {
                        active_total: 1,
                        deleted_total: -1,
                        admin_account_id: product.account_id,
                    };
                    await client.query<Product_Field>('SELECT * FROM upsert_product_total($1, $2, $3::UUID)', [
                        upsert_product_total_body.active_total,
                        upsert_product_total_body.deleted_total,
                        upsert_product_total_body.admin_account_id,
                    ]);

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Product_Field> = {
                        aggregate_id: product.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.PRODUCT,
                        event_type: Kafka_Event_Event_Type_Enum.PRODUCT_RE_DELETED,
                        topic: Kafka_Event_Topic_Enum.PRODUCT_EVENTS,
                        payload: product,
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
                    return product;
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Re_Delete_Product error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Re_Delete_Product;
