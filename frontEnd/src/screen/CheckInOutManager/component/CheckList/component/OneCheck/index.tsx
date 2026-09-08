import { memo } from 'react';
import style from './style.module.scss';

const OneCheck = () => {
    return <div className={style.parent}>OneCheck</div>;
};

export default memo(OneCheck);
