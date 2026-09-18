import { consume_Statistics } from '@src/messageQueue/Consumer';
import { Update_Statistics_Body_Field } from '@src/data_struct/statistics/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';
import { is_Update_Statistics } from './handle/Update_Statistics';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

function handleStatistics() {
    consume_Statistics(`statistics${prefix}`, async (data) => {
        const update_statistics_Body: Update_Statistics_Body_Field = { ...data, of_day: new Date(data.of_day) };

        const is = await is_Update_Statistics(update_statistics_Body);
        return is;
    });
}

export { handleStatistics };
