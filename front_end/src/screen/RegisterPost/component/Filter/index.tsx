import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { set__get_register_posts_body } from '@src/redux/slice/Register_Post';
import { Account_Field } from '@src/data_struct/account';
import { SEARCH } from '@src/const/text';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [is_del, set__is_del] = useState<boolean>(false);
    const [is_n_del, set__is_n_del] = useState<boolean>(false);

    const hadle_Del = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__is_del(e.target.checked);
    };

    const hadle_N_Del = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__is_n_del(e.target.checked);
    };

    const handle_Search = () => {
        let is_delete: boolean | undefined = undefined;

        if (!account) return;

        if ((is_del && is_n_del) || (!is_del && !is_n_del)) {
            is_delete = undefined;
        } else if (is_del) {
            is_delete = true;
        } else if (is_n_del) {
            is_delete = false;
        }

        dispatch(set__get_register_posts_body({ page: 1, size: 10, is_delete: is_delete, account_id: account.id }));
    };

    return (
        <div className={style.parent}>
            <div className={style.options}>
                <div>
                    <input checked={is_del} onChange={(e) => hadle_Del(e)} type="checkbox" />
                    <div>Đã xóa</div>
                </div>
                <div>
                    <input checked={is_n_del} onChange={(e) => hadle_N_Del(e)} type="checkbox" />
                    <div>Chưa xóa</div>
                </div>
            </div>
            <div className={style.btn}>
                <div onClick={() => handle_Search()}>{SEARCH}</div>
            </div>
        </div>
    );
};

export default memo(Filter);
