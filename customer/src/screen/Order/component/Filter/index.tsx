import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoIosSearch } from 'react-icons/io';
import { set_getOrdersWithPhoneBody } from '@src/redux/slice/Order';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [phoneInput, setPhoneInput] = useState<string>('');

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneInput(value);
    };

    const handleSearch = () => {
        dispatch(set_getOrdersWithPhoneBody({ page: 1, size: 5, phone: phoneInput.trim() }));
    };

    return (
        <div className={style.parent}>
            <div>
                <input value={phoneInput} onChange={(e) => handlePhoneInput(e)} placeholder="Nhập số điện thoại" />
                <IoIosSearch onClick={() => handleSearch()} size={22} />
            </div>
        </div>
    );
};

export default memo(Filter);
