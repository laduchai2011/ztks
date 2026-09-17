import { pool } from '@src/connect/postgresql';
import { Create_Customer_Body_Field } from '@src/data_struct/customer/body';
import { Customer_Field } from '@src/data_struct/customer';

class MutateDB_Create_Customer {
    private _create_customer_body: Create_Customer_Body_Field | undefined;

    set_Create_Customer_Body = (create_customer_body: Create_Customer_Body_Field) => {
        this._create_customer_body = create_customer_body;
    };

    is_Check_Phone = async (phone: string): Promise<boolean> => {
        return await is_Check_Phone(phone);
    };

    async run(): Promise<Customer_Field | void> {
        if (this._create_customer_body !== undefined) {
            try {
                const result = create_To_Db(this._create_customer_body);
                return result;
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error('MutateDB_CreateCustomer: error method run()');
        }
    }
}

async function is_Check_Phone(phone: string): Promise<boolean> {
    const result = await pool.query<Customer_Field>(`SELECT * FROM customer WHERE phone = $1;`, [phone]);

    const account = result.rows[0];

    if (account) {
        return true;
    }
    return false;
}

async function create_To_Db(create_customer_body: Create_Customer_Body_Field): Promise<Customer_Field | void> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await pool.query<Customer_Field>(`SELECT * FROM create_customer($1, $2);`, [
            create_customer_body.phone,
            create_customer_body.password,
        ]);

        await client.query('COMMIT');

        return result.rows[0];
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}

export default MutateDB_Create_Customer;
