import axios from 'axios';
import qs from 'qs';
import LockError, { Lock } from 'redlock';
import { serviceRedlock } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { TokenZaloField, TokenResField } from '@src/dataStruct/tokenZalo';
import { redisKey_storeTokenZalo, redisKey_storeTokenZalo_lock } from '@src/const/zalo';
import { mssqlGetValue, mssqlUpdateValue } from '@src/cache/cacheMssql';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

const timeExpireat = 60 * 60 * 24 * 30 * 12;

export async function getAccessToken(): Promise<string | null> {
    const zaloToken = await serviceRedis.getData<TokenZaloField>(redisKey_storeTokenZalo);
    // return zaloToken?.access_token ?? null;
    if (!zaloToken) {
        console.error('getAccessToken', 'Failed to get token in Redis');
        return null;
    }

    return zaloToken.access_token;
}

interface RefreshOptionField {
    repeat: number;
}
export async function refreshAccessToken(refreshOptionField: RefreshOptionField): Promise<string | null> {
    let lock: Lock | null = null;
    const repeat = refreshOptionField.repeat;
    if (repeat === 0) {
        console.error('FINISH repeat REFRESH ERROR');
        return null;
    }

    try {
        lock = await serviceRedlock.acquire([redisKey_storeTokenZalo_lock], 3000);

        const zaloToken = await serviceRedis.getData<TokenZaloField>(redisKey_storeTokenZalo);
        if (!zaloToken) {
            console.error('refreshAccessToken', 'Failed to get token in Redis');
            return handleWhenRedisRestart();
        }

        const body = qs.stringify({
            app_id: '2474292114893114248',
            grant_type: 'refresh_token',
            refresh_token: zaloToken.refresh_token,
        });

        const res = await axios.post<TokenResField>('https://oauth.zaloapp.com/v4/oa/access_token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Secret_key: '7XFkowzBCeRBRGqDhUkL',
            },
        });

        const newToken = res.data.access_token;
        const newRefresh = res.data.refresh_token;

        if (!(newToken && newRefresh)) {
            console.error('Failed to get new access token and refresh token');
            return null;
        }

        zaloToken.access_token = newToken;
        zaloToken.refresh_token = newRefresh;

        const resultupdate = await mssqlUpdateValue(redisKey_storeTokenZalo, JSON.stringify(zaloToken));
        if (!resultupdate?.isSuccess) {
            console.error('Failed mssqlUpdateValue refresh token (zalo token)');
            return null;
        }

        const isSet = await serviceRedis.setDataAgain<TokenZaloField>(redisKey_storeTokenZalo, zaloToken);
        if (!isSet) {
            console.error('Failed to set new token in Redis');
            return null;
        }

        return newToken;
    } catch (err: any) {
        if (err instanceof LockError) {
            return refreshAccessToken({ repeat: repeat - 1 });
        } else {
            console.error('REFRESH ERROR:', err.response?.data || err);
            return null;
        }
    } finally {
        if (lock) {
            await lock.release();
        }
    }
}

async function handleWhenRedisRestart() {
    const resultget = await mssqlGetValue(redisKey_storeTokenZalo);

    if (resultget.isSuccess && resultget.data) {
        const zaloToken = JSON.parse(resultget.data?.value) as TokenResField;
        const body = qs.stringify({
            app_id: '2474292114893114248',
            grant_type: 'refresh_token',
            refresh_token: zaloToken.refresh_token,
        });

        const res = await axios.post<TokenResField>('https://oauth.zaloapp.com/v4/oa/access_token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Secret_key: '7XFkowzBCeRBRGqDhUkL',
            },
        });

        const newToken = res.data.access_token;
        const newRefresh = res.data.refresh_token;

        if (!(newToken && newRefresh)) {
            console.error('Failed to get new access token and refresh token');
            return null;
        }

        zaloToken.access_token = newToken;
        zaloToken.refresh_token = newRefresh;

        const resultupdate = await mssqlUpdateValue(redisKey_storeTokenZalo, JSON.stringify(zaloToken));
        if (!resultupdate.isSuccess) {
            console.error('Failed mssqlUpdateValue refresh token (zalo token)');
            return null;
        }

        const isSet = await serviceRedis.setData<TokenZaloField>(redisKey_storeTokenZalo, zaloToken, timeExpireat);
        if (!isSet) {
            console.error('Failed to set new token in Redis');
            return null;
        }

        return newToken;
    } else {
        console.log('handleWhenRedisRestart', 'mssqlGetValue failure');
        return null;
    }
}
