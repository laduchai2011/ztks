import { consumeStatistics } from '@src/messageQueue/Consumer';
import { UpdateStatisticsBodyField } from '@src/dataStruct/statistics/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';
import { isUpdateStatistics } from './handle/UpdateStatistics';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

function handleStatistics() {
    consumeStatistics(`statistics${prefix}`, async (data) => {
        const updateStatisticsBody: UpdateStatisticsBodyField = { ...data, ofDay: new Date(data.ofDay) };

        const is = await isUpdateStatistics(updateStatisticsBody);
        return is;
    });
}

export { handleStatistics };
