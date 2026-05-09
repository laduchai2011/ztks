import { memo, FC } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import { handleSrcImage } from '@src/utility/string';

const OneMember: FC<{ data: AccountField }> = ({ data }) => {
    const avatarUrl = data.avatar ? handleSrcImage(data.avatar) : avatarnull;

    return (
        <div className={style.parent}>
            <img src={avatarUrl} alt="avatar" />
            <div>{`${data.firstName} ${data.lastName}`}</div>
        </div>
    );
};

export default memo(OneMember);
