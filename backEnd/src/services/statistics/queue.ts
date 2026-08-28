import { consumeStringMessage } from '@src/messageQueue/Consumer';
import {
    AddSalesBodyField,
    GetStatisticsOfDayBodyField,
    CreateStatisticsBodyField,
    UpdateStatisticsWithNewOrderBodyField,
    UpdateStatisticsWithOldOrderBodyField,
} from '@src/dataStruct/statistics/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';
import { getStatisticsOfDay } from './handle/GetStatisticsOfDay';
import { createStatistics } from './handle/CreateStatistics';
import { updateStatisticsWithNewOrder } from './handle/UpdateStatisticsWithNewOrder';
import { updateStatisticsWithOldOrder } from './handle/UpdateStatisticsWithOldOrder';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

function handleStatistics() {
    consumeStringMessage(`statistics${prefix}`, async (msg) => {
        const _msg = JSON.parse(msg) as AddSalesBodyField;
        const addSalesBody: AddSalesBodyField = { ..._msg, ofDay: new Date(_msg.ofDay) };

        const getStatisticsOfDayBody: GetStatisticsOfDayBodyField = {
            ofDay: addSalesBody.ofDay,
            zaloOaId: addSalesBody.zaloOaId,
            accountId: addSalesBody.accountId,
        };

        const r_get = await getStatisticsOfDay(getStatisticsOfDayBody);

        if (r_get) {
            if (addSalesBody.isNew) {
                const updateStatisticsWithNewOrderBody: UpdateStatisticsWithNewOrderBodyField = {
                    sales: addSalesBody.sales,
                    zaloOaId: addSalesBody.zaloOaId,
                    accountId: addSalesBody.accountId,
                    ofDay: addSalesBody.ofDay,
                };

                updateStatisticsWithNewOrder(updateStatisticsWithNewOrderBody);
            } else {
                const updateStatisticsWithOldOrderBody: UpdateStatisticsWithOldOrderBodyField = {
                    sales: addSalesBody.sales,
                    zaloOaId: addSalesBody.zaloOaId,
                    accountId: addSalesBody.accountId,
                    ofDay: addSalesBody.ofDay,
                };

                updateStatisticsWithOldOrder(updateStatisticsWithOldOrderBody);
            }
        } else {
            const createStatisticsBody: CreateStatisticsBodyField = {
                sales: addSalesBody.sales,
                zaloOaId: addSalesBody.zaloOaId,
                accountId: addSalesBody.accountId,
                ofDay: addSalesBody.ofDay,
            };

            createStatistics(createStatisticsBody);
        }
    });
}

export { handleStatistics };
