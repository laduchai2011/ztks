import axios from 'axios';
import qs from 'qs';
import LockError, { Lock } from 'redlock';
import { serviceRedlock } from '@src/connect';
import { mssql_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { TokenResField } from '@src/dataStruct/tokenZalo';
import { ZaloOaTokenField, ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { prefix_cache_zalo_accessToken_with_zaloOaId } from '@src/const/redisKey';
import QueryDB_GetZaloOaTokenWithFk from './GetZaloOaTokenWithFk';
// import MutateDB_CreateZaloOaTokenWithFk from './CreateZaloOaToken';
import MutateDB_UpdateRefreshTokenOfZaloOa from './UpdateRefreshTokenOfZaloOa';
import { my_log } from '@src/log';

mssql_server.init();

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const timeExpireat = 60 * 60 * 24 * 30 * 12;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAccessToken(zaloOa: ZaloOaField) {
    const zaloOaId = zaloOa.id;
    const zaloAccessToken = await serviceRedis.getData<string>(
        `${prefix_cache_zalo_accessToken_with_zaloOaId}_${zaloOaId}`
    );
    if (!zaloAccessToken) {
        console.error('getAccessToken', 'Failed to get token in Redis');
        return;
    }

    return zaloAccessToken;
}

export async function refreshAccessToken(zaloApp: ZaloAppField, zaloOa: ZaloOaField, repeat: number) {
    const app_id = zaloApp.appId;
    const app_secret = zaloApp.appSecret;
    const zaloOaId = zaloOa.id;

    const redisKey = `${prefix_cache_zalo_accessToken_with_zaloOaId}_${zaloOaId}`;
    const lockKey = `${prefix_cache_zalo_accessToken_with_zaloOaId}_${zaloOaId}_lock`;
    let lock: Lock | null = null;
    if (repeat === 0) {
        console.error('FINISH repeat REFRESH ERROR');
        return;
    }

    try {
        await serviceRedis.deleteData(redisKey);

        lock = await serviceRedlock.acquire([lockKey], 3000);

        const connection_pool = mssql_server.get_connectionPool();
        if (!connection_pool) {
            my_log.withYellow('Kết nối cơ sở dữ liệu không thành công !');
            return;
        }

        const queryDB = new QueryDB_GetZaloOaTokenWithFk();
        queryDB.setGetZaloOaTokenWithFkBody({ zaloOaId: zaloOaId });
        queryDB.set_connection_pool(connection_pool);

        const result = await queryDB.run();
        if (!(result?.recordset.length && result?.recordset.length > 0)) return;

        const zaloOaToken: ZaloOaTokenField = result?.recordset[0];

        // console.log('zaloOaToken', zaloOaToken);

        const body = qs.stringify({
            app_id: app_id,
            grant_type: 'refresh_token',
            refresh_token: zaloOaToken.refreshToken,
        });

        const res = await axios.post<TokenResField>('https://oauth.zaloapp.com/v4/oa/access_token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Secret_key: app_secret,
            },
        });

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        if (!(newAccessToken && newRefreshToken)) {
            console.error('Failed to get new access token and refresh token');
            return;
        }

        const queryDB_u = new MutateDB_UpdateRefreshTokenOfZaloOa();
        queryDB_u.setUpdateRefreshTokenOfZaloOaBody({ refreshToken: newRefreshToken, zaloOaId: zaloOaId });
        queryDB_u.set_connection_pool(connection_pool);

        const result_u = await queryDB_u.run();
        if (!(result_u?.recordset.length && result_u?.recordset.length > 0)) return;

        const isSet = await serviceRedis.setData<string>(redisKey, newAccessToken, timeExpireat);
        if (!isSet) {
            console.error('Failed to set new token in cookie in Redis');
            return;
        }

        return newAccessToken;
    } catch (err: any) {
        if (err instanceof LockError) {
            console.log('LockError');
            await sleep(1000);
            const accessToken = await getAccessToken(zaloOa);
            if (accessToken) {
                return;
            }
            return refreshAccessToken(zaloApp, zaloOa, repeat - 1);
        } else {
            console.error('REFRESH ERROR:', err.response?.data || err);
            return;
        }
    } finally {
        if (lock) {
            await lock.release();
        }
    }
}
