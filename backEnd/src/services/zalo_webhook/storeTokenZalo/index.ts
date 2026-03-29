// import ServiceRedis from '@src/cache/cacheRedis';
// import { TokenZaloField } from '@src/dataStruct/tokenZalo';
// import { redisKey_storeTokenZalo } from '@src/const/zalo';

// const serviceRedis = ServiceRedis.getInstance();
// const timeExpireat = 60 * 60 * 24 * 30 * 12; // 1 year

async function storeTokenZalo() {
    // await serviceRedis.init();
    // const tokenZalo: TokenZaloField = {
    //     access_token_message: process.env.ZALO_ACCESS_TOKEN_MESSAGE || '',
    //     access_token_infor: process.env.ZALO_ACCESS_TOKEN_INFOR || '',
    //     refresh_token: process.env.ZALO_REFRESH_TOKEN || '',
    // };
    // await serviceRedis.setData<TokenZaloField>(redisKey_storeTokenZalo, tokenZalo, timeExpireat);
}

export { storeTokenZalo };
