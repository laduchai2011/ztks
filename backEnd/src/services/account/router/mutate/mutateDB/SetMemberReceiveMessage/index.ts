import { MutateDB } from '@src/services/account/interface';
import { AccountField } from '@src/dataStruct/account';
import ServiceRedis from '@src/cache/cacheRedis';
import { redisKey_memberReceiveMessage } from '@src/const/redisKey';

const serviceRedis = ServiceRedis.getInstance();
serviceRedis.init();
const timeExpireat = 60 * 60 * 24 * 30 * 12; // 1 year

class MutateDB_SetMemberReceiveMessage extends MutateDB {
    private _member: AccountField | undefined;

    constructor() {
        super();
    }

    setMember = (member: AccountField) => {
        this._member = member;
    };

    async run(): Promise<AccountField | void> {
        const key = redisKey_memberReceiveMessage;

        if (this._member !== undefined) {
            try {
                const result = await serviceRedis.setData<AccountField>(key, this._member, timeExpireat);

                if (result) {
                    return this._member;
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('MutateDB_SetMemberReceiveMessage: error method run()');
        }
    }
}

export default MutateDB_SetMemberReceiveMessage;
