import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { SEARCH } from '@src/const/text';
import { set__data__searched_account_id } from '@src/redux/slice/Member';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searched_id, set__searched_id] = useState<string>('');

    const handle_Searched_Account_Id = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__searched_id(value);
    };

    const handle_Search = () => {
        dispatch(set__data__searched_account_id(searched_id));
    };

    return (
        <div className={style.parent}>
            <div>
                <input
                    value={searched_id}
                    onChange={(e) => handle_Searched_Account_Id(e)}
                    placeholder="Nhập id người dùng !"
                />
            </div>
            <div>
                <div onClick={() => handle_Search()}>{SEARCH}</div>
            </div>
        </div>
    );
};

export default memo(Filter);
