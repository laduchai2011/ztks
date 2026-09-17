import { pool } from '@src/connect/postgresql';
import { Customer_Field } from '@src/data_struct/customer';

class QueryDB_Customer_Get_Me {
    private _customer_id: string | undefined;

    set_Customer_Id(customer_id: string): void {
        this._customer_id = customer_id;
    }

    async run(): Promise<Customer_Field | void> {
        if (this._customer_id !== undefined) {
            try {
                const result = await pool.query<Customer_Field>(`SELECT * FROM customer_get_me($1);`, [
                    this._customer_id,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Customer_Get_Me;
