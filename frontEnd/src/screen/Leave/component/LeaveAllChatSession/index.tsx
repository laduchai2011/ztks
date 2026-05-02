import { memo } from 'react';
import style from './style.module.scss';
import { LEAVE } from '@src/const/text';
import { setData_toastMessage } from '@src/redux/slice/Leave';
import { route_enum } from '@src/router/type';

const LeaveAllChatSession = () => {
    return (
        <div className={style.parent}>
            <div className={style.header}>Bạn cần rời khỏi các trạng thái nhận tin nhắn</div>
            <div className={style.buttonContainer}>
                <div>{LEAVE}</div>
            </div>
        </div>
    );
};

export default memo(LeaveAllChatSession);
