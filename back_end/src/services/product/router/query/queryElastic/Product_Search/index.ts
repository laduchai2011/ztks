import elasticClient from '@src/connect/elastic';
import { Product_Search_Body_Field } from '@src/data_struct/product/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

export async function QueryElastic_Product_Search(product_search_body: Product_Search_Body_Field) {
    return await elasticClient.searchTemplate({
        index: `product${prefix}`,
        id: `product${prefix}_search`,
        params: {
            account_id: product_search_body.account_id,
            search_content: product_search_body.search_content,
            from: product_search_body.from,
            size: product_search_body.size,
        },
    });
}
