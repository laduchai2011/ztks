import elasticClient from '@src/connect/elastic';
import { Product_Code_Search_Body_Field } from '@src/data_struct/product/body';
import { getEnv } from '@src/mode';
import { myEnv } from '@src/mode/type';

const prefix = getEnv() === myEnv.Dev ? '_dev' : '';

export async function QueryDB_Product_Code_Search(product_code_search_body: Product_Code_Search_Body_Field) {
    return await elasticClient.searchTemplate({
        index: `product_code${prefix}`,
        id: `product_code${prefix}_search`,
        params: {
            account_id: product_code_search_body.account_id,
            search_content: product_code_search_body.search_content,
            from: product_code_search_body.from,
            size: product_code_search_body.size,
        },
    });
}
