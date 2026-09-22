import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Require_Take_Money_Field, Wallet_Field } from '@src/data_struct/wallet';

export interface state_props {
    is_loading: boolean;
    toast_message: {
        data: ToastMessage_Data_Props;
    };
    take_money_dialog: {
        is_show: boolean;
        wallet?: Wallet_Field;
        required_take_money?: Require_Take_Money_Field;
        new_require_take_money?: Require_Take_Money_Field;
    };
}
