import { memo } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const OneMember = () => {
    return (
        <div className={style.parent}>
            <div className={style.index}>1</div>
            <div className={style.avatar}>
                <img src={avatarnull} alt="Member Avatar" />
            </div>
            <div className={style.name}>John Doe</div>
            <div className={style.role}>Developer</div>
            <div className={style.icons}>
                <FaLock size={20} color="red" />
                <MdDelete size={20} color="red" />
            </div>
        </div>
    );
};

export default memo(OneMember);
