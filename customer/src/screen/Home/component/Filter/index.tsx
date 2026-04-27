import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { CiSearch } from 'react-icons/ci';
import { set_registerPostId, setData_toastMessage } from '@src/redux/slice/Home';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { isPositiveInteger } from '@src/utility/string';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [registerPostId, setRegisterPostId] = useState<string>('');

    const handleRegisterPostId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterPostId(e.target.value);
    };

    const handleSearch = () => {
        if (!isPositiveInteger(registerPostId)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Định danh phải là số nguyên dương !',
                })
            );
            return;
        }

        dispatch(set_registerPostId(Number(registerPostId)));
    };

    return (
        <div className={style.parent}>
            <div>
                <input value={registerPostId} onChange={(e) => handleRegisterPostId(e)} placeholder="Nhập định danh" />
                <CiSearch onClick={() => handleSearch()} size={23} />
            </div>
        </div>
    );
};

export default memo(Filter);
