import { pool } from '@src/connect/postgresql';
import { Customer_Field } from '@src/data_struct/customer';
import { Signin_Customer_Body_Field } from '@src/data_struct/customer/body';

class QueryDB_Signin {
    private _signin_customer_body: Signin_Customer_Body_Field | undefined;

    set_Signin_Customer_Body(signin_customer_body: Signin_Customer_Body_Field): void {
        this._signin_customer_body = signin_customer_body;
    }

    async run(): Promise<Customer_Field | undefined> {
        if (this._signin_customer_body !== undefined) {
            try {
                const result = await pool.query<Customer_Field>(`SELECT * FROM signin_customer($1, $2);`, [
                    this._signin_customer_body.phone,
                    this._signin_customer_body.password,
                ]);

                return result.rows[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default QueryDB_Signin;
