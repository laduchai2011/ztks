import elasticClient from '@src/connect/elastic';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

export async function Product_Code_Search(account_id: string, search_content: string, from = 0, size = 20) {
    return await elasticClient.searchTemplate({
        index: `product_code${prefix}`,
        id: 'product_code_search',
        params: {
            account_id,
            search_content,
            from,
            size,
        },
    });
}
