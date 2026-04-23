import { memo } from 'react';
import style from './style.module.scss';
import { RECEIVE, RECEIVED } from '@src/const/text';

const One = () => {
    return (
        <div className={style.parent}>
            <div className={style.overview}>
                <div className={style.index}>index</div>
                <div className={style.money}>money</div>
                <div className={style.account}>account</div>
                <div className={style.isDo}>da chuyen</div>
                <div className={style.doTime}>thoi gian chuyen</div>
                <div className={style.btn}>
                    {/* <div className={style.button}>{RECEIVE}</div> */}
                    <div className={style.txt}>{RECEIVED}</div>
                </div>
            </div>
            <div className={style.detail}></div>
        </div>
    );
};

export default memo(One);
