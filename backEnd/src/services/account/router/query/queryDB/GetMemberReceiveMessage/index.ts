import { QueryDB } from '@src/services/account/interface';
import { AccountField } from '@src/dataStruct/account';
import ServiceRedis from '@src/cache/cacheRedis';
import { redisKey_memberReceiveMessage } from '@src/const/redisKey';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();

class QueryDB_GetMemberReceiveMessage extends QueryDB {
    constructor() {
        super();
    }

    async run(): Promise<AccountField | void> {
        const key = redisKey_memberReceiveMessage;

        try {
            const result = await serviceRedis.getData<AccountField>(key);

            if (result) {
                return result;
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default QueryDB_GetMemberReceiveMessage;
