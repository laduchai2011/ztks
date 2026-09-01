import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import { route_enum } from '@src/router/type';

const ToolBar = () => {
    const navigate = useNavigate();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [avatarUrl, setAvatarUrl] = useState<string>(avatarnull);

    useEffect(() => {
        const avatarUrl_ = account?.avatar ? handleSrcImage(account.avatar) : avatarnull;
        setAvatarUrl(avatarUrl_);
    }, [account]);

    const handleGoToHome = () => {
        navigate(route_enum.HOME);
    };

    const handleGoToProfile = () => {
        navigate(route_enum.PROFILE);
    };

    return (
        <div className={style.parent}>
            <div className={style.logoZtks}>
                <img src={handleSrcImage('logo.jpg')} onClick={() => handleGoToHome()} alt="logoZtks" />
            </div>
            <div className={style.options}>
                <div className={style.selected}>Dash board</div>
                {/* <div>Phản hồi</div>
                <div>Hỗ trợ</div> */}
            </div>
            <div className={style.avatar}>
                <img onClick={() => handleGoToProfile()} src={avatarUrl} alt="logoZtks" />
            </div>
        </div>
    );
};

export default memo(ToolBar);
