import { pool } from '@src/connect/postgresql';
import { Product_Field } from '@src/data_struct/product';
import { Edit_Product_Body_Field } from '@src/data_struct/product/body';
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

class MutateDB_Edit_Product {
    private _edit_product_body: Edit_Product_Body_Field | undefined;

    set_Edit_Product_Body(edit_product_body: Edit_Product_Body_Field): void {
        this._edit_product_body = edit_product_body;
    }

    async run(): Promise<Product_Field | undefined> {
        if (this._edit_product_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await client.query<Product_Field>(
                    'SELECT * FROM edit_product($1::UUID, $2, $3, $4, $5, $6, $7, $8::UUID, $9::UUID, $10::UUID, $11::JSONB, $12::JSONB)',
                    [
                        this._edit_product_body.id,
                        this._edit_product_body.name,
                        this._edit_product_body.description,
                        this._edit_product_body.detail,
                        this._edit_product_body.is_compelled_price,
                        this._edit_product_body.unit_price,
                        this._edit_product_body.is_lock,
                        this._edit_product_body.store_id,
                        this._edit_product_body.product_code_id,
                        this._edit_product_body.account_id,
                        JSON.stringify(this._edit_product_body.images),
                        JSON.stringify(this._edit_product_body.videos),
                    ]
                );

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('EDIT_PRODUCT_FAILED');
                } else {
                    const product = result.rows[0];

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Product_Field> = {
                        aggregate_id: product.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.PRODUCT,
                        event_type: Kafka_Event_Event_Type_Enum.PRODUCT_EDITED,
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

                console.error('Edit_Product error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Edit_Product;
