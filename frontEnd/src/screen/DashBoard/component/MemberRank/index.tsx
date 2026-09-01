import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/DashBoard';
import { avatarnull } from '@src/utility/string';

const MemberRank = () => {
    const [memberList, setMemberList] = useState<string[]>(['', '', '', '']);

    const list_member = memberList.map((item, index) => {
        return (
            <div className={style.aRow}>
                <div>anh</div>
                <div>ten</div>
                <div>doanh so</div>
                <div>da thanh toan</div>
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>Xếp hạng</div>
            <div className={style.list}>{list_member}</div>
        </div>
    );
};

export default memo(MemberRank);
