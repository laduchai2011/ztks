import { Product_Field } from '@src/data_struct/product';

export interface state_props {
    product?: Product_Field;

    create_status: 'begin' | 'end';
}
