import { pool } from '@src/connect/postgresql';
import { Customer_Field } from '@src/data_struct/customer';
import { Customer_Forget_Password_Body_Field } from '@src/data_struct/customer/body';

class MutateDB_Customer_Forget_Password {
    private _customer_forget_password_body: Customer_Forget_Password_Body_Field | undefined;

    set_Customer_Forget_Password_Body(customer_forget_password_body: Customer_Forget_Password_Body_Field): void {
        this._customer_forget_password_body = customer_forget_password_body;
    }

    async run(): Promise<Customer_Field | undefined> {
        if (this._customer_forget_password_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Customer_Field>(`SELECT * FROM customer_forget_password($1, $2);`, [
                    this._customer_forget_password_body.phone,
                    this._customer_forget_password_body.password,
                ]);

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

export default MutateDB_Customer_Forget_Password;
