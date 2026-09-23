import { memo, FC } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { Account_Field } from '@src/data_struct/account';
import { handleSrcImage } from '@src/utility/string';

const OneMember: FC<{ data: Account_Field }> = ({ data }) => {
    const avatar_url = data.avatar ? handleSrcImage(data.avatar) : avatarnull;

    return (
        <div className={style.parent}>
            <img src={avatar_url} alt="avatar" />
            <div>{`${data.first_name} ${data.last_name}`}</div>
        </div>
    );
};

export default memo(OneMember);
