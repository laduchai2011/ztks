import { Shop_Field, Depot_Field } from '@src/data_struct/shop';

export interface state_props {
    is_show_create_shop: boolean;
    selected_shop?: Shop_Field;
    shop_list: Shop_Field[];
    is_show_create_depot: boolean;
    selected_depot?: Depot_Field;
    depot_list: Depot_Field[];
}
