import { pool } from '@src/connect/postgresql';
import { Product_Code_Field } from '@src/data_struct/product';
import { Create_Product_Code_Body_Field } from '@src/data_struct/product/body';
import {
    Kafka_Event_Field,
    Kafka_Event_Topic_Enum,
    Kafka_Event_Event_Type_Enum,
    Kafka_Event_Aggregate_Type_Enum,
} from '@src/data_struct/kafka';
import { Create_Kafka_Event_Body_Field } from '@src/data_struct/kafka/body';

class MutateDB_Create_Product_Code {
    private _create_product_code_body: Create_Product_Code_Body_Field | undefined;

    set_Create_Product_Code_Body(create_product_code_body: Create_Product_Code_Body_Field): void {
        this._create_product_code_body = create_product_code_body;
    }

    async run(): Promise<Product_Code_Field | undefined> {
        if (this._create_product_code_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await client.query<Product_Code_Field>(
                    'SELECT * FROM create_product_code($1, $2, $3, $4, $5::JSONB, $6::JSONB)',
                    [
                        this._create_product_code_body.name,
                        this._create_product_code_body.description,
                        this._create_product_code_body.detail,
                        this._create_product_code_body.account_id,
                        JSON.stringify(this._create_product_code_body.images),
                        JSON.stringify(this._create_product_code_body.videos),
                    ]
                );

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    throw new Error('CREATE_ORDER_FAILED');
                } else {
                    const product_code = result.rows[0];

                    const create_kafka_event_body: Create_Kafka_Event_Body_Field<Product_Code_Field> = {
                        aggregate_id: product_code.id,
                        aggregate_type: Kafka_Event_Aggregate_Type_Enum.PRODUCT,
                        event_type: Kafka_Event_Event_Type_Enum.PRODUCT_CODE_CREATED,
                        topic: Kafka_Event_Topic_Enum.PRODUCT_EVENTS,
                        payload: product_code,
                    };

                    const result_kafka_event = await client.query<Kafka_Event_Field>(
                        'SELECT * FROM create_kafka_event($1::UUID, $2, $3, $4, $5::JSONB)',
                        [
                            create_kafka_event_body.aggregate_id,
                            create_kafka_event_body.aggregate_type,
                            create_kafka_event_body.event_type,
                            create_kafka_event_body.topic,
                            create_kafka_event_body.payload,
                        ]
                    );

                    if (result_kafka_event.rows.length === 0) {
                        await client.query('ROLLBACK');
                        throw new Error('CREATE_KAFKA_EVENT_FAILED');
                    }

                    await client.query('COMMIT');
                    return product_code;
                }
            } catch (error) {
                try {
                    await client.query('ROLLBACK');
                } catch (rollbackError) {
                    console.error('Rollback error:', rollbackError);
                }

                console.error('Create_Product_Code error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Create_Product_Code;
