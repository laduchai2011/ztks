import { pool } from '@src/connect/postgresql';
import { Wallet_Field } from '@src/data_struct/wallet';
import { Pay_Agent_From_Wallet_Body_Field } from '@src/data_struct/wallet/body';

class MutateDB_Pay_Agent_From_Wallet {
    private _pay_agent_from_wallet_body: Pay_Agent_From_Wallet_Body_Field | undefined;

    set_Pay_Agent_From_Wallet_Body(pay_agent_from_wallet_body: Pay_Agent_From_Wallet_Body_Field): void {
        this._pay_agent_from_wallet_body = pay_agent_from_wallet_body;
    }

    async run(): Promise<Wallet_Field | undefined> {
        if (this._pay_agent_from_wallet_body !== undefined) {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const result = await pool.query<Wallet_Field>(`SELECT * FROM pay_agent_from_wallet($1, $2, $3);`, [
                    this._pay_agent_from_wallet_body.wallet_id,
                    this._pay_agent_from_wallet_body.agent_pay_id,
                    this._pay_agent_from_wallet_body.account_id,
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

export default MutateDB_Pay_Agent_From_Wallet;
