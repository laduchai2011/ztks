import { consumeStringMessage } from '@src/messageQueue/Consumer';
import { AddSalesBodyField } from '@src/dataStruct/statistics/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';
import { createStatistics } from './handle/CreateStatistics';
import { updateStatistics } from './handle/UpdateStatistics';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

function handleStatistics() {
    consumeStringMessage(`statistics${prefix}`, async (msg) => {
        const addSalesBody = JSON.parse(msg) as AddSalesBodyField;
        console.log('consumeStringMessage', addSalesBody);
    });
}

export { handleStatistics };
