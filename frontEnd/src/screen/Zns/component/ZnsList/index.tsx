import { memo } from 'react';
import style from './style.module.scss';
import { SEE_MORE } from '@src/const/text';

const ZnsList = () => {
    return (
        <div className={style.parent}>
            <div className={style.seeMore}>
                <div>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(ZnsList);
