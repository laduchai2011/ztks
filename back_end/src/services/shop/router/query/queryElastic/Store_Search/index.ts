import elasticClient from '@src/connect/elastic';
import { Store_Search_Body_Field } from '@src/data_struct/shop/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

export async function QueryElastic_Store_Search(store_search_body: Store_Search_Body_Field) {
    return await elasticClient.searchTemplate({
        index: `store${prefix}`,
        id: `store${prefix}_search`,
        params: {
            account_id: store_search_body.depot_id,
            search_content: store_search_body.search_content,
            from: store_search_body.from,
            size: store_search_body.size,
        },
    });
}
