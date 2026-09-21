import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { route_enum } from '@src/router/type';
import OneMember from './component/OneMember';
import { setData_toastMessage } from '@src/redux/slice/DashBoard';

const MemberRank = () => {
    const [memberList, setMemberList] = useState<string[]>(['', '', '', '']);

    const list_member = memberList.map((item, index) => {
        return <OneMember key={index} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>Xếp hạng</div>
            <div className={style.list}>{list_member}</div>
        </div>
    );
};

export default memo(MemberRank);
