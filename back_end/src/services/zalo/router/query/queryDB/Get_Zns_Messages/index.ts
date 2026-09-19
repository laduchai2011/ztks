import { pool } from '@src/connect/postgresql';
import { Zns_Message_Field, Paged_Zns_Message_Field } from '@src/data_struct/zalo';
import { Get_Zns_Messages_Body_Field } from '@src/data_struct/zalo/body';

class QueryDB_Get_Zns_Messages {
    private _get_zns_messages_body: Get_Zns_Messages_Body_Field | undefined;

    set_Get_Zns_Messages_Body(get_zns_messages_body: Get_Zns_Messages_Body_Field): void {
        this._get_zns_messages_body = get_zns_messages_body;
    }

    async run(): Promise<Paged_Zns_Message_Field | void> {
        if (this._get_zns_messages_body !== undefined) {
            try {
                const result = await pool.query<{
                    items: Zns_Message_Field[];
                    total_count: string;
                }>(`SELECT * FROM get_orders($1, $2, $3, $4);`, [
                    this._get_zns_messages_body.page,
                    this._get_zns_messages_body.size,
                    this._get_zns_messages_body.zns_template_id,
                    this._get_zns_messages_body.account_id,
                ]);

                const data: Paged_Zns_Message_Field = {
                    items: result.rows[0].items,
                    total_count: Number(result.rows[0].total_count),
                };

                return data;
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Get_Zns_Messages;
