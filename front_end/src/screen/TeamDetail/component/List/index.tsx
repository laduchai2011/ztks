import { memo } from 'react';
import style from './style.module.scss';
import OneMember from './component/OneMember';

const List = () => {
    return (
        <div className={style.parent}>
            <OneMember />
            <OneMember />
            <OneMember />
            <OneMember />
            <OneMember />
            <OneMember />
            <OneMember />
            <OneMember />
            <OneMember />
        </div>
    );
};

export default memo(List);
