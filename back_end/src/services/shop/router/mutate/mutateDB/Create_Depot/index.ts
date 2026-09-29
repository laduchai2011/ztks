import { pool } from '@src/connect/postgresql';
import { Depot_Field } from '@src/data_struct/shop';
import { Create_Depot_Body_Field } from '@src/data_struct/shop/body';

class MutateDB_Create_Depot {
    private _create_depot_body: Create_Depot_Body_Field | undefined;

    set_Create_Depot_Body(create_depot_body: Create_Depot_Body_Field): void {
        this._create_depot_body = create_depot_body;
    }

    async run(): Promise<Depot_Field | undefined> {
        if (this._create_depot_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Depot_Field>(
                    'SELECT * FROM create_depot($1, $2, $3, $4, $5, $6::UUID, $7::UUID)',
                    [
                        this._create_depot_body.name,
                        this._create_depot_body.description,
                        this._create_depot_body.content,
                        this._create_depot_body.address,
                        this._create_depot_body.phone,
                        this._create_depot_body.shop_id,
                        this._create_depot_body.account_id,
                    ]
                );

                await client.query('COMMIT');

                if (result.rows.length > 0) {
                    return result.rows[0];
                }
            } catch (error) {
                console.error('PostgreSQL error:', error);
                throw error;
            } finally {
                client.release();
            }
        }
    }
}

export default MutateDB_Create_Depot;
