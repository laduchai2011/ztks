import { memo } from 'react';
import style from './style.module.scss';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { IoMdLock, IoMdUnlock } from 'react-icons/io';

const OneStore = () => {
    return (
        <div className={style.parent}>
            <div>name name</div>
            <IoMdLock color="red" />
        </div>
    );
};

export default memo(OneStore);
