import { memo } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { avatarnull } from '@src/utility/string';

const ToolBar = () => {
    return (
        <div className={style.parent}>
            <div className={style.logoZtks}>
                <img src={avatarnull} alt="logoZtks" />
            </div>
            <div className={style.options}>
                <div className={style.selected}>Dash board</div>
                <div>Phản hồi</div>
                <div>Hỗ trợ</div>
            </div>
            <div className={style.avatar}>
                <img src={avatarnull} alt="logoZtks" />
            </div>
        </div>
    );
};

export default memo(ToolBar);
