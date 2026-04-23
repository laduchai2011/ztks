import { memo } from 'react';
import style from './style.module.scss';
import Title from './component/Title';
import One from './component/One';

const List = () => {
    return (
        <div className={style.parent}>
            <div>
                <Title />
            </div>
            <div>
                <One />
                <One />
                <One />
                <One />
                <One />
                <One />
                <One />
                <One />
                <One />
            </div>
        </div>
    );
};

export default memo(List);
