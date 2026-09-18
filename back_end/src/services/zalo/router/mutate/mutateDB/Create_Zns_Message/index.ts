import { pool } from '@src/connect/postgresql';
import { Zns_Message_Field } from '@src/data_struct/zalo';
import { Create_Zns_Message_Body_Field } from '@src/data_struct/zalo/body';

class MutateDB_Create_Zns_Message {
    private _create_zns_message_body: Create_Zns_Message_Body_Field | undefined;

    set_Create_Zns_Message_Body(create_zns_message_body: Create_Zns_Message_Body_Field): void {
        this._create_zns_message_body = create_zns_message_body;
    }

    async run(): Promise<Zns_Message_Field | void> {
        if (this._create_zns_message_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Zns_Message_Field>(
                    `SELECT * FROM create_zns_message($1, $2, $3, $4, $5);`,
                    [
                        this._create_zns_message_body.type,
                        this._create_zns_message_body.data,
                        this._create_zns_message_body.cost,
                        this._create_zns_message_body.zns_template_id,
                        this._create_zns_message_body.account_id,
                    ]
                );

                await client.query('COMMIT');

                return result.rows[0];
            } catch (error) {
                console.error(error);
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Create_Zns_Message;
