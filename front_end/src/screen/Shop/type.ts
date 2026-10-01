import { Shop_Field, Depot_Field } from '@src/data_struct/shop';

export interface state_props {
    is_show_create_shop: boolean;
    is_show_edit_shop: boolean;
    is_show_delete_shop: boolean;
    selected_shop?: Shop_Field;
    new_shop?: Shop_Field;
    selected_edit_shop?: Shop_Field;
    edited_shop?: Shop_Field;
    selected_delete_shop?: Shop_Field;
    deleted_shop?: Shop_Field;

    is_show_create_depot: boolean;
    is_show_edit_depot: boolean;
    is_show_delete_depot: boolean;
    selected_depot?: Depot_Field;
    new_depot?: Depot_Field;
    selected_edit_depot?: Depot_Field;
    edited_depot?: Depot_Field;
    selected_delete_depot?: Depot_Field;
    deleted_depot?: Depot_Field;
}
