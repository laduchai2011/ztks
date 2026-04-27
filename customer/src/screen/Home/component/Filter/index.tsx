import { memo } from 'react';
import style from './style.module.scss';
import { CiSearch } from 'react-icons/ci';

const Filter = () => {
    return (
        <div className={style.parent}>
            <div>
                <input placeholder="Nhập định danh" />
                <CiSearch size={23} />
            </div>
        </div>
    );
};

export default memo(Filter);
