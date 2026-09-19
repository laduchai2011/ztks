import axios from 'axios';
import qs from 'qs';
import LockError from 'redlock';
import { serviceRedlock } from '@src/connect';
// import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { Token_Res_Field } from '@src/data_struct/token_zalo';
import { Zalo_Oa_Token_Field, Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { prefix_cache__zalo_access_token_with_zalo_oa_id } from '@src/const/redisKey';
import QueryDB_Get_Zalo_Oa_Token_With_Fk from './Get_Zalo_Oa_Token_With_Fk';
import MutateDB_Update_Refresh_Token_Of_Zalo_Oa from './Update_Refresh_Token_Of_Zalo_Oa';
import { my_log } from '@src/log';

// mssql_server.init();

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const timeExpireat = 60 * 1; // 1p

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function get_Access_Token(zalo_oa: Zalo_Oa_Field) {
    const zalo_oa_id = zalo_oa.id;
    const zalo_access_token = await serviceRedis.getData<string>(
        `${prefix_cache__zalo_access_token_with_zalo_oa_id}_${zalo_oa_id}`
    );
    if (!zalo_access_token) {
        console.error('getAccessToken', 'Failed to get token in Redis');
        return;
    }

    return zalo_access_token;
}

export async function refresh_Access_Token(zalo_app: Zalo_App_Field, zalo_oa: Zalo_Oa_Field, repeat: number) {
    const app_id = zalo_app.app_id;
    const app_secret = zalo_app.app_secret;
    const zalo_oa_id = zalo_oa.id;

    const redis_key = `${prefix_cache__zalo_access_token_with_zalo_oa_id}_${zalo_oa_id}`;
    const lock_key = `${prefix_cache__zalo_access_token_with_zalo_oa_id}_${zalo_oa_id}_lock`;
    let lock: Lock | null = null;
    if (repeat === 0) {
        console.error('FINISH repeat REFRESH ERROR');
        return;
    }

    try {
        await serviceRedis.deleteData(redis_key);

        lock = await serviceRedlock.acquire([lock_key], 3000);

        const queryDB = new QueryDB_Get_Zalo_Oa_Token_With_Fk();
        queryDB.set_Get_Zalo_Oa_Token_With_Fk_Body({ zalo_oa_id: zalo_oa_id, account_id: zalo_oa.account_id });

        const result = await queryDB.run();
        if (!result) return;

        const zalo_oa_token: Zalo_Oa_Token_Field = result;

        // console.log('zaloOaToken', zaloOaToken);

        const body = qs.stringify({
            app_id: app_id,
            grant_type: 'refresh_token',
            refresh_token: zalo_oa_token.refresh_token,
        });

        const res = await axios.post<Token_Res_Field>('https://oauth.zaloapp.com/v4/oa/access_token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Secret_key: app_secret,
            },
        });

        const new_access_token = res.data.access_token;
        const new_refresh_token = res.data.refresh_token;

        if (!(new_access_token && new_refresh_token)) {
            console.error('Failed to get new access token and refresh token');
            return;
        }

        const queryDB_u = new MutateDB_Update_Refresh_Token_Of_Zalo_Oa();
        queryDB_u.set_Update_Refresh_Token_Of_Zalo_Oa_Body({
            refresh_token: new_refresh_token,
            zalo_oa_id: zalo_oa_id,
            account_id: zalo_oa.account_id,
        });

        const result_u = await queryDB_u.run();
        if (!result_u) return;

        const is_set = await serviceRedis.setData<string>(redis_key, new_access_token, timeExpireat);
        if (!is_set) {
            console.error('Failed to set new token in cookie in Redis');
            return;
        }

        return new_access_token;
    } catch (err: any) {
        if (err instanceof LockError) {
            await sleep(1000);
            const access_token = await get_Access_Token(zalo_oa);
            if (access_token) {
                return;
            }
            return refresh_Access_Token(zalo_app, zalo_oa, repeat - 1);
        } else {
            console.error('REFRESH ERROR:', err.response?.data || err);
            return;
        }
    } finally {
        if (lock) {
            await (lock as any).release();
        }
    }
}
