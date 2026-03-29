import { memo, FC } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';

const OneMember: FC<{ data: AccountField }> = ({ data }) => {
    return (
        <div className={style.parent}>
            <img src={data.avatar ? data.avatar : avatarnull} alt="avatar" />
            <div>{`${data.firstName} ${data.lastName}`}</div>
        </div>
    );
};

export default memo(OneMember);
