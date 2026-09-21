import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { SEARCH } from '@src/const/text';
import { setData_searchedAccountId } from '@src/redux/slice/Member';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchedId, setSearchedId] = useState<string>('');

    const handleSearchedAccountId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchedId(value);
    };

    const handleSearch = () => {
        dispatch(setData_searchedAccountId(searchedId));
    };

    return (
        <div className={style.parent}>
            <div>
                <input
                    value={searchedId}
                    onChange={(e) => handleSearchedAccountId(e)}
                    placeholder="Nhập id người dùng !"
                />
            </div>
            <div>
                <div onClick={() => handleSearch()}>{SEARCH}</div>
            </div>
        </div>
    );
};

export default memo(Filter);
