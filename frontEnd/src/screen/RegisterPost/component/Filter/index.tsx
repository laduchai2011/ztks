import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { set_getRegisterPostsBody } from '@src/redux/slice/RegisterPost';
import { AccountField } from '@src/dataStruct/account';
import { SEARCH } from '@src/const/text';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [isDel, setIsDel] = useState<boolean>(false);
    const [isNDel, setIsNDel] = useState<boolean>(false);

    const hadleDel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDel(e.target.checked);
    };

    const hadleNDel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsNDel(e.target.checked);
    };

    const handleSearch = () => {
        let isDelete: boolean | undefined = undefined;

        if (!account) return;

        if ((isDel && isNDel) || (!isDel && !isNDel)) {
            isDelete = undefined;
        } else if (isDel) {
            isDelete = true;
        } else if (isNDel) {
            isDelete = false;
        }

        dispatch(set_getRegisterPostsBody({ page: 1, size: 10, isDelete: isDelete, accountId: account.id }));
    };

    return (
        <div className={style.parent}>
            <div className={style.options}>
                <div>
                    <input checked={isDel} onChange={(e) => hadleDel(e)} type="checkbox" />
                    <div>Đã xóa</div>
                </div>
                <div>
                    <input checked={isNDel} onChange={(e) => hadleNDel(e)} type="checkbox" />
                    <div>Chưa xóa</div>
                </div>
            </div>
            <div className={style.btn}>
                <div onClick={() => handleSearch()}>{SEARCH}</div>
            </div>
        </div>
    );
};

export default memo(Filter);
